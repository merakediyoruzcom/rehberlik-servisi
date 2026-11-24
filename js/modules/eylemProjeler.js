/**
 * Rehberlik Servisi — Eylem Planı ve Proje Modülü
 * Okul projeleri, MEB il/ilçe eylem planları ve resmi yazı takipleri
 */

class EylemProjelerModule {
  constructor() {
    this.projects = [];
    this.currentFilter = 'aktif'; // 'hepsi', 'aktif', 'arsiv', 'il'
    this.viewMode = 'kart'; // 'kart' veya 'zaman'
    this.searchQuery = '';
  }

  async load() {
    this.projects = await window.appDB.getAll('eylemProjeler');
    if (this.projects.length === 0) {
      await this.seedDefaultProjects();
      this.projects = await window.appDB.getAll('eylemProjeler');
    }
    this.render();
  }

  async seedDefaultProjects() {
    const defaults = [
      {
        id: 1,
        title: 'Okul Bağımlılıkla Mücadele Eylem Planı (TBM)',
        category: 'il',
        startDate: '2026-10-01',
        endDate: '2027-06-15',
        responsible: 'PDR Servisi & Yeşilay Kulübü',
        status: 'aktif',
        progress: 35,
        tasks: [
          { text: 'Öğrenci seminerlerinin tamamlanması (Teknoloji & Tütün)', done: true },
          { text: 'Veli bilinçlendirme bülteninin dağıtılması', done: true },
          { text: 'TBM sınıf rehberlik etkinliklerinin uygulanması', done: false },
          { text: 'Dönem sonu değerlendirme raporunun RAM\'a gönderilmesi', done: false }
        ]
      },
      {
        id: 2,
        title: 'Okullarda Şiddetin Önlenmesi ve Barışçıl İklim Eylem Planı',
        category: 'il',
        startDate: '2026-09-20',
        endDate: '2027-06-10',
        responsible: 'Psikososyal Destek Ekibi & Okul İdaresi',
        status: 'aktif',
        progress: 25,
        tasks: [
          { text: 'Okul risk haritasının çıkarılması', done: true },
          { text: 'Akran arabuluculuğu ve öfke kontrolü atölyeleri', done: false },
          { text: 'Öğretmenler kurulunda bilgilendirme sunumu', done: false }
        ]
      },
      {
        id: 3,
        title: 'Üniversite ve Meslek Tanıtım Fuarı (Kariyer Günleri)',
        category: 'okul',
        startDate: '2026-11-15',
        endDate: '2026-12-25',
        responsible: 'PDR Servisi & 12. Sınıf Rehber Öğretmenleri',
        status: 'aktif',
        progress: 50,
        tasks: [
          { text: 'Konuk akademisyen ve mezunlarla iletişim', done: true },
          { text: 'Tanıtım afiş ve broşürlerinin hazırlanması', done: true },
          { text: 'Konferans salonu oturum planlaması', done: false }
        ]
      },
      {
        id: 4,
        title: 'Psikososyal Önleyici Destek ve Afet Sonrası Müdahale',
        category: 'il',
        startDate: '2026-09-10',
        endDate: '2027-05-30',
        responsible: 'Kriz Müdahale Ekibi',
        status: 'aktif',
        progress: 40,
        tasks: [
          { text: 'Kriz müdahale ekibi toplantı tutanakları', done: true },
          { text: 'Psikolojik ilk yardım broşürü hazırlanması', done: true },
          { text: 'Öğrenci grup çalışmaları', done: false }
        ]
      }
    ];

    for (const p of defaults) {
      await window.appDB.add('eylemProjeler', p);
    }
  }

  setFilter(filter) {
    this.currentFilter = filter;
    // Buton aktifliklerini güncelle
    document.querySelectorAll('#view-eylemProjeler .pill-btn[data-filter]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-filter') === filter);
    });
    this.render();
  }

  setSearch(q) {
    this.searchQuery = q.toLowerCase();
    this.render();
  }

  render() {
    const listEl = document.getElementById('project-cards-container');
    const badgeEl = document.getElementById('project-active-badge');
    if (!listEl) return;

    let filtered = this.projects.filter(p => {
      if (this.currentFilter === 'aktif' && p.status !== 'aktif') return false;
      if (this.currentFilter === 'arsiv' && p.status !== 'arsiv') return false;
      if (this.currentFilter === 'il' && p.category !== 'il') return false;

      if (this.searchQuery) {
        return p.title.toLowerCase().includes(this.searchQuery) ||
               (p.responsible && p.responsible.toLowerCase().includes(this.searchQuery));
      }
      return true;
    });

    const activeCount = this.projects.filter(p => p.status === 'aktif').length;
    if (badgeEl) badgeEl.textContent = `${activeCount} AKTİF ÇALIŞMA`;

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <div class="empty-icon">🎯</div>
          <h3>Henüz çalışma bulunamadı</h3>
          <p>Seçili filtreye uygun proje, eylem planı ya da resmi yazı kaydı bulunmuyor.</p>
          <button class="btn-primary-action" onclick="window.eylemProjelerModule.openNewProjectModal()">+ Çalışma Ekle</button>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(p => {
      const completedTasks = (p.tasks || []).filter(t => t.done).length;
      const totalTasks = (p.tasks || []).length;
      const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (p.progress || 0);

      return `
        <div class="project-card">
          <div class="project-card-header">
            <h4>${escapeHtml(p.title)}</h4>
            <span class="badge ${p.category === 'il' ? 'primary' : 'info'}">
              ${p.category === 'il' ? 'İl Eylem Planı' : 'Okul Projesi'}
            </span>
          </div>

          <div class="project-card-meta">
            <span>📅 ${p.startDate || ''} — ${p.endDate || ''}</span>
          </div>
          <div style="font-size:12px; color:var(--text-muted);">
            👥 <strong>Sorumlu:</strong> ${escapeHtml(p.responsible || 'PDR Servisi')}
          </div>

          <div class="project-card-progress">
            <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:600; color:var(--text-muted);">
              <span>Tamamlanma Oranı</span>
              <span>%${pct} (${completedTasks}/${totalTasks} görev)</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${pct}%;"></div>
            </div>
          </div>

          <div style="font-size:12px; background:#f8fafc; padding:8px 12px; border-radius:8px; display:flex; flex-direction:column; gap:4px;">
            ${(p.tasks || []).slice(0, 2).map(t => `
              <div style="display:flex; align-items:center; gap:6px; color:${t.done ? 'var(--text-muted)' : 'var(--text-main)'};">
                <span>${t.done ? '✅' : '⚪'}</span>
                <span style="${t.done ? 'text-decoration:line-through;' : ''}">${escapeHtml(t.text)}</span>
              </div>
            `).join('')}
            ${totalTasks > 2 ? `<span style="font-size:11px; color:var(--primary); font-weight:600;">+ ${totalTasks - 2} görev daha...</span>` : ''}
          </div>

          <div class="project-card-footer">
            <span style="font-size:11.5px; color:${p.status === 'aktif' ? '#10b981' : '#64748b'}; font-weight:600;">
              ● ${p.status === 'aktif' ? 'Yürütülüyor' : 'Arşivlendi'}
            </span>
            <div style="display:flex; gap:6px;">
              <button class="header-btn" style="padding:4px 8px; font-size:11.5px;" onclick="window.eylemProjelerModule.printProject(${p.id})">🖨️ Yazdır</button>
              <button class="header-btn" style="padding:4px 8px; font-size:11.5px; color:var(--danger);" onclick="window.eylemProjelerModule.deleteProject(${p.id})">🗑️</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  openNewProjectModal() {
    const modal = document.getElementById('new-project-modal');
    if (modal) modal.classList.add('open');
  }

  async saveProjectFromForm() {
    const title = document.getElementById('modal-prj-title').value.trim();
    const category = document.getElementById('modal-prj-category').value;
    const startDate = document.getElementById('modal-prj-start').value;
    const endDate = document.getElementById('modal-prj-end').value;
    const responsible = document.getElementById('modal-prj-resp').value.trim();
    const task1 = document.getElementById('modal-prj-task1').value.trim();
    const task2 = document.getElementById('modal-prj-task2').value.trim();

    if (!title) {
      alert('Lütfen çalışma başlığını giriniz.');
      return;
    }

    const tasks = [];
    if (task1) tasks.push({ text: task1, done: false });
    if (task2) tasks.push({ text: task2, done: false });

    const newPrj = {
      title,
      category,
      startDate,
      endDate,
      responsible: responsible || 'Rehberlik Servisi',
      status: 'aktif',
      progress: 0,
      tasks
    };

    await window.appDB.add('eylemProjeler', newPrj);
    window.app.closeModal('new-project-modal');
    await this.load();
    window.app.showToast('Yeni çalışma / eylem planı eklendi.');
  }

  async deleteProject(id) {
    if (confirm('Bu çalışmayı silmek istediğinize emin misiniz?')) {
      await window.appDB.delete('eylemProjeler', id);
      await this.load();
      window.app.showToast('Çalışma silindi.');
    }
  }

  async printProject(id) {
    const p = await window.appDB.get('eylemProjeler', id);
    if (!p) return;

    const printArea = document.getElementById('print-area');
    printArea.innerHTML = `
      <div class="meb-header">
        <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI</h2>
        <h3>ÇATALCA ANADOLU LİSESİ REHBERLİK VE PSİKOLOJİK DANIŞMA SERVİSİ</h3>
        <p><strong>EYLEM PLANI / PROJE ÇALIŞMA FORMU</strong></p>
      </div>

      <table class="print-table">
        <tr>
          <th style="width:25%;">Çalışma / Proje Adı</th>
          <td colspan="3"><strong>${escapeHtml(p.title)}</strong></td>
        </tr>
        <tr>
          <th>Kategori Türü</th>
          <td>${p.category === 'il' ? 'MEB İl/İlçe Eylem Planı' : 'Okul İçi PDR Projesi'}</td>
          <th>Uygulama Tarihleri</th>
          <td>${p.startDate || ''} — ${p.endDate || ''}</td>
        </tr>
        <tr>
          <th>Sorumlu Ekip / Birim</th>
          <td colspan="3">${escapeHtml(p.responsible || 'Rehberlik ve Psikolojik Danışma Servisi')}</td>
        </tr>
        <tr>
          <th>Hedef Faaliyetler ve İş Akışı</th>
          <td colspan="3">
            <ul style="padding-left:20px; line-height:1.6;">
              ${(p.tasks || []).map(t => `<li>[ ${t.done ? 'X' : ' '} ] ${escapeHtml(t.text)}</li>`).join('')}
            </ul>
          </td>
        </tr>
      </table>

      <div class="signature-area">
        <div class="sign-box">
          <div class="role">Sorumlu Rehber Öğretmen</div>
          <div>İmza: ........................</div>
        </div>
        <div class="sign-box">
          <div class="role">Okul Müdürü</div>
          <div>İmza / Mühür: ........................</div>
        </div>
      </div>
    `;

    window.print();
  }
}

window.eylemProjelerModule = new EylemProjelerModule();
