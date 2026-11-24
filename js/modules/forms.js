/**
 * Rehberlik Servisi — Form ve Belge Modülü
 * MEB Desimal Dosya Sistemi (805.01 vb.) ve Resmi PDR Formları
 */

class FormsModule {
  constructor() {
    this.forms = [
      {
        code: '805.01.01',
        title: 'Öğrenci Ön Görüşme ve Tanıma Formu',
        category: 'Öğrenci Tanıma',
        desc: 'Öğrencinin aile, sağlık, ilgi ve yetenek bilgilerini toplayan standart form.'
      },
      {
        code: '805.01.02',
        title: 'RAM Eğitsel Değerlendirme İstek Formu (Okul Yönlendirme)',
        category: 'Özel Eğitim / RAM',
        desc: 'Rehberlik ve Araştırma Merkezine inceleme ve tanılama için öğrenci sevk formu.'
      },
      {
        code: '805.02.01',
        title: 'RİBA (Rehberlik İhtiyaçları Belirleme Anketi) — Lise Öğrenci Formu',
        category: 'İhtiyaç Belirleme',
        desc: 'Öğrencilerin gelişim alanlarındaki ihtiyaçlarını belirlemek için MEB ölçeği.'
      },
      {
        code: '805.02.02',
        title: 'RİBA (Rehberlik İhtiyaçları Belirleme Anketi) — Öğretmen ve Veli Formu',
        category: 'İhtiyaç Belirleme',
        desc: 'Öğretmen ve velilerin okula yönelik rehberlik beklentilerini tespit anketi.'
      },
      {
        code: '805.03.01',
        title: 'Sosyometri Uygulama ve İlişki Matrisi Çizelgesi',
        category: 'Bireyi Tanıma',
        desc: 'Sınıf içi sosyal etkileşim, liderlik, yalnızlık ve klikleşme analiz formu.'
      },
      {
        code: '805.03.02',
        title: 'Başarısızlık Nedenleri Anketi (BNA)',
        category: 'Akademik Başarı',
        desc: 'Ders başarısını olumsuz etkileyen okul, aile ve kişisel etmenler envanteri.'
      }
    ];
  }

  render() {
    const container = document.getElementById('forms-list-container');
    if (!container) return;

    container.innerHTML = this.forms.map(f => `
      <div class="card-panel" style="margin-bottom:14px;">
        <div class="panel-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="badge primary">${f.code}</span>
            <h3 style="font-size:14.5px;">📄 ${escapeHtml(f.title)}</h3>
          </div>
          <button class="header-btn" onclick="window.formsModule.printForm('${f.code}')">🖨️ Form Şablonunu Yazdır</button>
        </div>
        <div style="padding:14px 20px;">
          <div style="font-size:12.5px; color:var(--text-muted); margin-bottom:4px;"><strong>Kategori:</strong> ${f.category}</div>
          <p style="font-size:13px; color:#334155;">${escapeHtml(f.desc)}</p>
        </div>
      </div>
    `).join('');
  }

  printForm(code) {
    const f = this.forms.find(x => x.code === code);
    if (!f) return;

    const printArea = document.getElementById('print-area');
    printArea.innerHTML = `
      <div class="meb-header">
        <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI</h2>
        <h3>ÇATALCA ANADOLU LİSESİ REHBERLİK VE PSİKOLOJİK DANIŞMA SERVİSİ</h3>
        <p><strong>${escapeHtml(f.title).toUpperCase()}</strong></p>
        <div style="font-size:10pt; color:#666;">Desimal Kod: ${f.code}</div>
      </div>

      <table class="print-table">
        <tr>
          <th style="width:25%;">Öğrencinin Adı Soyadı</th>
          <td style="width:35%;">............................................................</td>
          <th style="width:20%;">Sınıfı / Şubesi / No</th>
          <td style="width:20%;">.... / .... / ....</td>
        </tr>
        <tr>
          <th>Uygulama Tarihi</th>
          <td>.... / .... / 2026</td>
          <th>Uygulayıcı</th>
          <td>Rehberlik Servisi</td>
        </tr>
      </table>

      <div style="border:1px solid #000; padding:16px; min-height:360px; margin-top:20px;">
        <p style="font-weight:bold; margin-bottom:12px;">Yönerge / Form İçeriği:</p>
        <p style="font-size:11pt; line-height:1.7;">${escapeHtml(f.desc)}</p>
        <div style="margin-top:40px; border-top:1px dashed #999; padding-top:20px; color:#555;">
          * Bu form çıktısı resmi dosyalama amacıyla arşivlenmek üzere hazırlanmıştır.
        </div>
      </div>

      <div class="signature-area">
        <div class="sign-box">
          <div class="role">Öğrenci / Veli İmzası</div>
          <div>........................</div>
        </div>
        <div class="sign-box">
          <div class="role">Psikolojik Danışman / Rehber Öğretmen</div>
          <div>İmza: ........................</div>
        </div>
      </div>
    `;
    window.print();
  }
}

window.formsModule = new FormsModule();
