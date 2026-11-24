/**
 * Rehberlik Servisi — Yıllık Rehberlik Faaliyetleri Modülü
 * MEB Yıllık Çerçeve Planı (Genel, Yerel ve Özel Hedefler + Faaliyet Takvimi)
 */

class YrfModule {
  constructor() {
    this.targets = {
      genel: ['Psikolojik Sağlamlık', 'Bilinçli Teknoloji Kullanımı'],
      yerel: ['Geleceği Planlama ve Kariyer Farkındalığı', 'Sosyal Beceriler ve İletişim'],
      ozel: ['Akademik Başarıyı Arttırma ve Verimli Çalışma', 'Akran Zorbalığını Önleme']
    };

    this.months = [
      {
        month: 'Eylül 2026',
        items: [
          'Okula Uyum (Oryantasyon) Çalışmaları',
          'RİBA (Rehberlik İhtiyaçları Belirleme Anketleri) Uygulaması',
          'Sene Başı Rehberlik Hizmetleri Yürütme Komisyonu Toplantısı'
        ]
      },
      {
        month: 'Ekim 2026',
        items: [
          'Sınıf Risk Haritalarının Sınıf Rehber Öğretmenlerinden Toplanması',
          'Okul Risk Haritasının Birleştirilmesi ve RAM\'a Bildirilmesi',
          'BEP Geliştirme Birimi Toplantıları ve BEP Planlarının Hazırlanması'
        ]
      },
      {
        month: 'Kasım 2026',
        items: [
          'Genel Hedef Etkinliği: Psikolojik Sağlamlık Semineri',
          '12. Sınıflar YKS Bilgilendirme ve Motivasyon Görüşmeleri',
          'Veli Semineri: Ergenlik Dönemi ve Aile İçi İletişim'
        ]
      },
      {
        month: 'Aralık 2026',
        items: [
          'Bilinçli Teknoloji Kullanımı ve Siber Zorbalık Atölyesi',
          'Ara Dönem BEP Değerlendirmeleri'
        ]
      }
    ];
  }

  render() {
    const targetsEl = document.getElementById('yrf-targets-container');
    const timelineEl = document.getElementById('yrf-timeline-container');
    if (!targetsEl || !timelineEl) return;

    targetsEl.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px;">
        <div style="background:#ffffff; border:1px solid var(--border-color); border-radius:12px; padding:16px;">
          <h4 style="color:#2563eb; font-size:13px; font-weight:700; margin-bottom:10px;">🏛️ MEB Genel Hedefleri</h4>
          <ul style="padding-left:18px; font-size:13px; line-height:1.6;">
            ${this.targets.genel.map(t => `<li><strong>${escapeHtml(t)}</strong></li>`).join('')}
          </ul>
        </div>

        <div style="background:#ffffff; border:1px solid var(--border-color); border-radius:12px; padding:16px;">
          <h4 style="color:#7c3aed; font-size:13px; font-weight:700; margin-bottom:10px;">📍 İl / İlçe Yerel Hedefleri</h4>
          <ul style="padding-left:18px; font-size:13px; line-height:1.6;">
            ${this.targets.yerel.map(t => `<li><strong>${escapeHtml(t)}</strong></li>`).join('')}
          </ul>
        </div>

        <div style="background:#ffffff; border:1px solid var(--border-color); border-radius:12px; padding:16px;">
          <h4 style="color:#10b981; font-size:13px; font-weight:700; margin-bottom:10px;">🏫 Okul Özel Hedefleri</h4>
          <ul style="padding-left:18px; font-size:13px; line-height:1.6;">
            ${this.targets.ozel.map(t => `<li><strong>${escapeHtml(t)}</strong></li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    timelineEl.innerHTML = this.months.map(m => `
      <div class="card-panel" style="margin-bottom:14px;">
        <div class="panel-header" style="background:#f8fafc;">
          <h3 style="font-size:14.5px;">📅 ${escapeHtml(m.month)}</h3>
        </div>
        <div style="padding:14px 20px;">
          <ul style="padding-left:18px; font-size:13.5px; line-height:1.7;">
            ${m.items.map(it => `<li>${escapeHtml(it)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  }
}

window.yrfModule = new YrfModule();
