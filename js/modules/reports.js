/**
 * Rehberlik Servisi — Raporlar & e-Rehberlik İstatistik Modülü
 */

class ReportsModule {
  async load() {
    const students = await window.appDB.getAll('students');
    const sessions = await window.appDB.getAll('sessions');
    const specialEdu = await window.appDB.getAll('specialEdu');

    // Dağılım sayıları
    const studentSessions = sessions.filter(s => s.type === 'ogrenci').length;
    const parentSessions = sessions.filter(s => s.type === 'veli').length;
    const teacherSessions = sessions.filter(s => s.type === 'ogretmen').length;

    // Kod dağılımı
    const codeCounts = {};
    sessions.forEach(s => {
      const code = s.mebCode || 'Diğer / Kodsuz';
      codeCounts[code] = (codeCounts[code] || 0) + 1;
    });

    const reportContentEl = document.getElementById('report-summary-cards');
    if (reportContentEl) {
      reportContentEl.innerHTML = `
        <div class="grid-stats">
          <div class="stat-card">
            <div class="stat-info">
              <h4>Öğrenci Görüşmeleri</h4>
              <div class="num">${studentSessions}</div>
            </div>
            <div class="stat-icon" style="background:#eef2ff; color:#4f46e5;">👨‍🎓</div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <h4>Veli Görüşmeleri</h4>
              <div class="num">${parentSessions}</div>
            </div>
            <div class="stat-icon" style="background:#fef3c7; color:#d97706;">👨‍👩‍👧</div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <h4>Öğretmen Görüşmeleri</h4>
              <div class="num">${teacherSessions}</div>
            </div>
            <div class="stat-icon" style="background:#ecfdf5; color:#059669;">👩‍🏫</div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <h4>Özel Eğitim & BEP</h4>
              <div class="num">${specialEdu.length}</div>
            </div>
            <div class="stat-icon" style="background:#fee2e2; color:#dc2626;">♿</div>
          </div>
        </div>

        <div class="card-panel">
          <div class="panel-header">
            <h3>📊 MEB e-Rehberlik Faaliyet Alanı Dağılımı</h3>
          </div>
          <div style="padding:20px;">
            <div style="display:flex; flex-direction:column; gap:12px;">
              ${Object.entries(codeCounts).map(([code, count]) => {
                const pct = sessions.length ? Math.round((count / sessions.length) * 100) : 0;
                return `
                  <div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:13px; font-weight:600;">
                      <span>${escapeHtml(code)}</span>
                      <span>${count} Oturum (%${pct})</span>
                    </div>
                    <div style="height:10px; background:#f1f5f9; border-radius:5px; overflow:hidden;">
                      <div style="width:${pct}%; height:100%; background:var(--primary); border-radius:5px;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    }
  }

  printTermReport() {
    window.appDB.getAll('sessions').then(sessions => {
      const studentSessions = sessions.filter(s => s.type === 'ogrenci').length;
      const parentSessions = sessions.filter(s => s.type === 'veli').length;
      const teacherSessions = sessions.filter(s => s.type === 'ogretmen').length;

      const printArea = document.getElementById('print-area');
      printArea.innerHTML = `
        <div class="meb-header">
          <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI</h2>
          <h3>ÇATALCA ANADOLU LİSESİ REHBERLİK VE PSİKOLOJİK DANIŞMA SERVİSİ</h3>
          <p><strong>DÖNEMLİK REHBERLİK VE PSİKOLOJİK DANIŞMA ÇALIŞMA RAPORU</strong></p>
        </div>

        <table class="print-table">
          <thead>
            <tr>
              <th>Faaliyet / Hizmet Türü</th>
              <th>Toplam Görüşme / Oturum Sayısı</th>
              <th>Açıklama</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bireysel Öğrenci Görüşmesi</td>
              <td><strong>${studentSessions}</strong></td>
              <td>Akademik, kişisel, eğitsel ve mesleki danışma</td>
            </tr>
            <tr>
              <td>Veli Görüşmesi</td>
              <td><strong>${parentSessions}</strong></td>
              <td>Veli bilgilendirme ve aile içi rehberlik</td>
            </tr>
            <tr>
              <td>Öğretmen / İdare Görüşmesi</td>
              <td><strong>${teacherSessions}</strong></td>
              <td>Müşavirlik (Konsültasyon) çalışmaları</td>
            </tr>
            <tr>
              <td><strong>GENEL TOPLAM</strong></td>
              <td><strong>${sessions.length}</strong></td>
              <td>Dönem boyunca yürütülen tüm bireysel çalışmalar</td>
            </tr>
          </tbody>
        </table>

        <div class="signature-area">
          <div class="sign-box">
            <div class="role">Okul Psikolojik Danışmanı / Rehber Öğretmen</div>
            <div>İmza: ........................</div>
          </div>
          <div class="sign-box">
            <div class="role">Okul Müdürü</div>
            <div>İmza / Mühür: ........................</div>
          </div>
        </div>
      `;
      window.print();
    });
  }
}

window.reportsModule = new ReportsModule();
