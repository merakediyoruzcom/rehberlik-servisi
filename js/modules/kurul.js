/**
 * Rehberlik Servisi — Kurul, Komisyon ve Toplantı Modülü
 * RHYK, BEP Geliştirme Birimi, ŞÖK ve Komisyon Tutanakları
 */

class KurulModule {
  constructor() {
    this.meetings = [
      {
        id: 1,
        title: 'Rehberlik Hizmetleri Yürütme Komisyonu (RHYK) Sene Başı Toplantısı',
        date: '2026-09-22',
        participants: 'Okul Müdürü, PDR Öğretmenleri, Sınıf Rehber Öğretmenleri Temsilcileri, Okul Aile Birliği Başkanı',
        decisions: 'Yıllık Rehberlik Programı onaylandı, RİBA anket takvimi kararlaştırıldı, risk haritası süreci başlatıldı.'
      },
      {
        id: 2,
        title: 'BEP Geliştirme Birimi 1. Dönem Karar Toplantısı',
        date: '2026-10-06',
        participants: 'Müdür Yrd., PDR Öğretmeni, Özel Eğitim Öğretmeni, Ders Öğretmenleri, Öğrenci Velileri',
        decisions: 'Tam zamanlı kaynaştırma öğrencileri için bireyselleştirilmiş eğitim planları (BEP) hazırlandı ve onaylandı.'
      },
      {
        id: 3,
        title: 'Okul Psikososyal Destek ve Kriz Müdahale Ekibi Toplantısı',
        date: '2026-10-10',
        participants: 'Okul İdaresi, Rehberlik Servisi, Nöbetçi Öğretmen Temsilcisi',
        decisions: 'Afet ve acil durum eylem adımları güncellendi, danışmanlık tedbiri uygulanan öğrenciler değerlendirildi.'
      }
    ];
  }

  render() {
    const container = document.getElementById('kurul-meetings-container');
    if (!container) return;

    container.innerHTML = this.meetings.map(m => `
      <div class="card-panel" style="margin-bottom:16px;">
        <div class="panel-header">
          <div>
            <h3>🏛️ ${escapeHtml(m.title)}</h3>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Toplantı Tarihi: <strong>${m.date}</strong></div>
          </div>
          <button class="header-btn" onclick="window.kurulModule.printMeeting(${m.id})">🖨️ Tutanağı Yazdır</button>
        </div>
        <div style="padding:18px 22px;">
          <div style="font-size:13px; margin-bottom:8px;">
            <strong>Katılımcılar:</strong> ${escapeHtml(m.participants)}
          </div>
          <div style="font-size:13px; background:#f8fafc; padding:12px; border-radius:8px;">
            <strong>Alınan Kararlar:</strong> ${escapeHtml(m.decisions)}
          </div>
        </div>
      </div>
    `).join('');
  }

  printMeeting(id) {
    const m = this.meetings.find(x => x.id === id);
    if (!m) return;

    const printArea = document.getElementById('print-area');
    printArea.innerHTML = `
      <div class="meb-header">
        <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI</h2>
        <h3>ÇATALCA ANADOLU LİSESİ MÜDÜRLÜĞÜ</h3>
        <p><strong>${escapeHtml(m.title).toUpperCase()} TOPLANTI TUTANAĞI</strong></p>
      </div>

      <table class="print-table">
        <tr>
          <th style="width:25%;">Toplantı Tarihi</th>
          <td>${m.date}</td>
        </tr>
        <tr>
          <th>Katılımcılar</th>
          <td>${escapeHtml(m.participants)}</td>
        </tr>
        <tr>
          <th>Gündem Maddeleri ve Alınan Kararlar</th>
          <td style="min-height:160px; vertical-align:top; line-height:1.6;">
            ${escapeHtml(m.decisions)}
          </td>
        </tr>
      </table>

      <div class="signature-area">
        <div class="sign-box">
          <div class="role">Komisyon Üyesi / PDR</div>
          <div>İmza: ........................</div>
        </div>
        <div class="sign-box">
          <div class="role">Okul Müdürü / Komisyon Başkanı</div>
          <div>İmza / Mühür: ........................</div>
        </div>
      </div>
    `;
    window.print();
  }
}

window.kurulModule = new KurulModule();
