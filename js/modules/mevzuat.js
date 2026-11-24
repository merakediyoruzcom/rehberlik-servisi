/**
 * Rehberlik Servisi — Mevzuat & Yönetmelik Modülü
 * MEB Rehberlik ve Psikolojik Danışma Hizmetleri Mevzuatı Çevrimdışı Kütüphanesi
 */

class MevzuatModule {
  constructor() {
    this.items = [
      {
        title: 'MEB Rehberlik ve Psikolojik Danışma Hizmetleri Yönetmeliği',
        date: '14 Ağustos 2020 — Sayı: 31213 (Güncel)',
        summary: 'Rehberlik servisinin görev, yetki ve sorumlulukları, çalışma saatleri, rehberlik ilkeleri ve yürütme komisyonu.',
        articles: [
          { no: 'Madde 4', text: 'Rehberlik ve psikolojik danışma hizmetleri; gizlilik, gönüllülük, süreklilik, kişi haklarına saygı, bireyin değerliliği ve özerkliği ilkelerine dayanır.' },
          { no: 'Madde 16', text: 'Psikolojik danışman ve rehber öğretmen, okulda nöbet görevi, ders tamamlama veya idari işlerde görevlendirilemez.' },
          { no: 'Madde 17', text: 'Bireysel psikolojik danışma ve rehberlik görüşmelerinde gizlilik esastır. Bu kayıtlar kilitli dolapta veya şifreli dijital ortamda korunur.' }
        ]
      },
      {
        title: 'Özel Eğitim Hizmetleri Yönetmeliği (BEP Esasları)',
        date: '07 Temmuz 2018 — Sayı: 30471',
        summary: 'Özel eğitime ihtiyacı olan öğrencilerin tanılanması, kaynaştırma/bütünleştirme uygulamaları ve BEP biriminin çalışması.',
        articles: [
          { no: 'Madde 67', text: 'Kaynaştırma/bütünleştirme yoluyla eğitimlerine devam eden öğrenciler için BEP geliştirme birimi tarafından Bireyselleştirilmiş Eğitim Programı hazırlanır.' },
          { no: 'Madde 28', text: 'Destek eğitim odası; tam zamanlı kaynaştırma öğrencilerine ihtiyaç duydukları derslerde haftalık toplam ders saatinin %40\'ını geçmeyecek şekilde açılır.' }
        ]
      },
      {
        title: '5395 Sayılı Çocuk Koruma Kanunu & Danışmanlık Tedbiri',
        date: '15 Temmuz 2005 — Sayı: 25876',
        summary: 'Korunma ihtiyacı olan veya suça sürüklenen çocuklar hakkında mahkemelerce verilen danışmanlık tedbirlerinin yerine getirilmesi.',
        articles: [
          { no: 'Madde 5/a', text: 'Danışmanlık tedbiri, çocuğun bakımından sorumlu olan kimselere çocuk yetiştirme konusunda; çocuklara da eğitim ve gelişimleri ile ilgili yol göstermeye yönelik tedbirdir.' }
        ]
      }
    ];
  }

  render() {
    const container = document.getElementById('mevzuat-list-container');
    if (!container) return;

    container.innerHTML = this.items.map(item => `
      <div class="card-panel" style="margin-bottom:16px;">
        <div class="panel-header">
          <div>
            <h3>📜 ${escapeHtml(item.title)}</h3>
            <div style="font-size:12px; color:var(--text-muted); margin-top:3px;">${escapeHtml(item.date)}</div>
          </div>
        </div>
        <div style="padding:18px 22px;">
          <p style="font-size:13.5px; color:#334155; margin-bottom:14px; font-weight:500;">
            ${escapeHtml(item.summary)}
          </p>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${item.articles.map(a => `
              <div style="background:#f8fafc; border-left:3px solid var(--primary); padding:10px 14px; border-radius:0 8px 8px 0;">
                <strong style="color:var(--primary); font-size:13px;">${escapeHtml(a.no)}:</strong>
                <span style="font-size:13px; color:#1e293b;">${escapeHtml(a.text)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }
}

window.mevzuatModule = new MevzuatModule();
