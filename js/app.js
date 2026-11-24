/**
 * Rehberlik Servisi — Ana Uygulama Kontrolcüsü (App Controller)
 */

class App {
  constructor() {
    this.currentView = 'agenda';
  }

  async init() {
    // 1. Olay dinleyicilerini derhal ve senkron olarak kur (asla gecikmeye veya hataya takılmasın)
    this.setupEventListeners();
    this.updateClock();
    setInterval(() => this.updateClock(), 30000);

    // 2. İlk arayüzü varsayılan olarak aç
    this.switchView('agenda');

    // 3. Veritabanını başlat ve verileri yükle
    try {
      if (window.appDB) {
        await window.appDB.init();
        const profile = await window.appDB.getSetting('school_profile');
        if (profile && profile.schoolName) {
          const el = document.getElementById('header-school-name');
          if (el) el.textContent = profile.schoolName;
        }
      }
    } catch (err) {
      console.error('Veritabanı başlatma uyarısı:', err);
    }

    // 4. Veritabanı hazır olunca aktif sayfayı tekrar güncelle
    this.refreshCurrentView();
  }

  updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeEl = document.getElementById('header-clock-time');
    if (timeEl) timeEl.textContent = `${hours}:${minutes}`;

    const options = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
    const dateStr = now.toLocaleDateString('tr-TR', options).toUpperCase();
    const dateEl = document.getElementById('header-clock-date');
    if (dateEl) dateEl.textContent = dateStr;
  }

  setupEventListeners() {
    // Menü butonları dinleyicisi
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const view = btn.getAttribute('data-view');
        if (view) this.switchView(view);
      };
    });

    // ESC ile modal kapatma
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
      }
    });
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Menü aktifliğini güncelle
    document.querySelectorAll('.nav-item').forEach(btn => {
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Bölümleri göster/gizle
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const activeSec = document.getElementById(`view-${viewName}`);
    if (activeSec) {
      activeSec.classList.add('active');
    }

    // Modül verilerini güvenle yükle
    this.refreshCurrentView();
  }

  async refreshCurrentView() {
    try {
      switch (this.currentView) {
        case 'agenda':
          if (window.agendaModule) await window.agendaModule.render();
          break;
        case 'students':
          if (window.studentsModule) await window.studentsModule.load();
          break;
        case 'sessions':
          if (window.sessionsModule) await window.sessionsModule.load();
          break;
        case 'classes':
          if (window.classesModule) await window.classesModule.load();
          break;
        case 'ozelegitim':
          if (window.specialEduModule) await window.specialEduModule.load();
          break;
        case 'eylemProjeler':
          if (window.eylemProjelerModule) await window.eylemProjelerModule.load();
          break;
        case 'yrf':
          if (window.yrfModule) await window.yrfModule.render();
          break;
        case 'kurul':
          if (window.kurulModule) await window.kurulModule.render();
          break;
        case 'mevzuat':
          if (window.mevzuatModule) await window.mevzuatModule.render();
          break;
        case 'forms':
          if (window.formsModule) await window.formsModule.render();
          break;
        case 'notes':
          if (window.notesModule) await window.notesModule.render();
          break;
        case 'reports':
          if (window.reportsModule) await window.reportsModule.load();
          break;
        case 'settings':
          if (window.settingsModule) await window.settingsModule.load();
          break;
      }
    } catch (e) {
      console.warn('Görünüm yüklenirken hata:', e);
    }
  }

  // Modallar
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  async openNewStudentModal() {
    const form = document.getElementById('new-student-form');
    if (form) form.reset();
    this.openModal('new-student-modal');
  }

  async openNewSessionModal() {
    const students = window.appDB ? await window.appDB.getAll('students') : [];
    const selectEl = document.getElementById('modal-session-student');
    if (selectEl) {
      selectEl.innerHTML = '<option value="">Öğrenci Seçiniz...</option>' + 
        students.map(s => `<option value="${s.id}">${s.no ? s.no + ' - ' : ''}${escapeHtml(s.name)} ${escapeHtml(s.surname)} (${s.classLevel}-${s.branch})</option>`).join('');
    }

    const now = new Date();
    const dateInput = document.getElementById('modal-session-date');
    if (dateInput) dateInput.value = now.toISOString().split('T')[0];
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeInput = document.getElementById('modal-session-time');
    if (timeInput) timeInput.value = `${hours}:${minutes}`;

    this.openModal('new-session-modal');
  }

  async openNewSessionModalForStudent(studentId) {
    await this.openNewSessionModal();
    const selectEl = document.getElementById('modal-session-student');
    if (selectEl) selectEl.value = studentId;
  }

  async startSessionFromAppt(apptId) {
    const appt = await window.appDB.get('appointments', apptId);
    if (!appt) return;
    await this.openNewSessionModal();
    const topicEl = document.getElementById('modal-session-topic');
    if (topicEl) topicEl.value = appt.topic || '';
    if (appt.time) {
      const timeEl = document.getElementById('modal-session-time');
      if (timeEl) timeEl.value = appt.time;
    }
  }

  // Tutanak Yazdır
  async printSession(sessionId) {
    const session = await window.appDB.get('sessions', sessionId);
    if (!session) return;

    const student = await window.appDB.get('students', session.studentId);
    const profile = await window.appDB.getSetting('school_profile') || {};

    const printArea = document.getElementById('print-area');
    if (!printArea) return;

    printArea.innerHTML = `
      <div class="meb-header">
        <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI</h2>
        <h3>${escapeHtml(profile.schoolName || 'ÇATALCA ANADOLU LİSESİ').toUpperCase()}</h3>
        <p><strong>REHBERLİK VE PSİKOLOJİK DANIŞMA SERVİSİ GÖRÜŞME TUTANAĞI</strong></p>
      </div>

      <table class="print-table">
        <tr>
          <th style="width:25%;">Öğrencinin Adı Soyadı</th>
          <td style="width:25%;"><strong>${escapeHtml(session.studentName)}</strong></td>
          <th style="width:25%;">Görüşme Tarihi & Saati</th>
          <td style="width:25%;">${session.date} - ${session.time || ''}</td>
        </tr>
        <tr>
          <th>Sınıfı ve Okul No</th>
          <td>${escapeHtml(session.classBranch || '-')} ${student && student.no ? '(' + student.no + ')' : ''}</td>
          <th>Görüşme Süresi</th>
          <td>${session.duration || 30} Dakika</td>
        </tr>
        <tr>
          <th>Görüşme Türü</th>
          <td>${session.type === 'veli' ? 'Veli Görüşmesi' : (session.type === 'ogretmen' ? 'Öğretmen Görüşmesi' : 'Öğrenci Görüşmesi')}</td>
          <th>MEB e-Rehberlik Kodu</th>
          <td>${escapeHtml(session.mebCode || 'Genel Görüşme')}</td>
        </tr>
        <tr>
          <th>Görüşme Konusu</th>
          <td colspan="3"><strong>${escapeHtml(session.topic)}</strong></td>
        </tr>
        <tr>
          <th>Görüşmenin Özeti</th>
          <td colspan="3" style="min-height:120px; vertical-align:top;">
            ${escapeHtml(session.summary || 'Özet belirtilmedi.')}
          </td>
        </tr>
        <tr>
          <th>Alınan Kararlar / Sonuç</th>
          <td colspan="3" style="min-height:80px; vertical-align:top;">
            ${escapeHtml(session.decisions || 'Özel bir karar belirtilmedi.')}
          </td>
        </tr>
      </table>

      <p style="font-size:10pt; color:#444; margin-top:10px;">
        * Bu tutanak 6698 sayılı Kişisel Verilerin Korunması Kanunu ve MEB Rehberlik ve Psikolojik Danışma Hizmetleri Yönetmeliği ilkeleri gereğince gizli tutulur.
      </p>

      <div class="signature-area">
        <div class="sign-box">
          <div class="role">Görüşülen Kişi<br>(${session.type === 'veli' ? 'Veli' : 'Öğrenci'})</div>
          <div>İmza: ........................</div>
        </div>
        <div class="sign-box">
          <div class="role">Okul Psikolojik Danışmanı /<br>Rehber Öğretmen</div>
          <div>${escapeHtml(profile.counselorName || 'Rehberlik Servisi')}<br>İmza: ........................</div>
        </div>
      </div>
    `;

    window.print();
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      font-size: 13.5px;
      font-weight: 500;
      z-index: 1000;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

// Global örnek
window.app = new App();

// DOM yüklenmişse hemen, yükleniyorsa event ile başlat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.app.init());
} else {
  window.app.init();
}
