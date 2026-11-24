/**
 * Rehberlik Servisi — Sınıflar & Sınıf Risk Haritası Modülü
 */

class ClassesModule {
  constructor() {
    this.classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
    this.selectedClass = '9-A';
  }

  async load() {
    const students = await window.appDB.getAll('students');
    this.renderClassSelector(students);
    this.renderRiskMap(students);
  }

  renderClassSelector(students) {
    const selectorEl = document.getElementById('class-select-buttons');
    if (!selectorEl) return;

    // Mevcut sınıfları öğrencilerden dinamik topla
    const classSet = new Set();
    students.forEach(s => {
      if (s.classLevel && s.branch) classSet.add(`${s.classLevel}-${s.branch}`);
    });
    const allClasses = Array.from(classSet).sort();
    if (allClasses.length > 0 && !allClasses.includes(this.selectedClass)) {
      this.selectedClass = allClasses[0];
    }

    selectorEl.innerHTML = allClasses.map(cls => `
      <button class="header-btn ${this.selectedClass === cls ? 'primary' : ''}" onclick="window.classesModule.selectClass('${cls}')">
        ${cls} Şubesi
      </button>
    `).join('');
  }

  selectClass(cls) {
    this.selectedClass = cls;
    this.load();
  }

  renderRiskMap(students) {
    const [level, branch] = this.selectedClass.split('-');
    const classStudents = students.filter(s => s.classLevel === level && s.branch === branch);

    document.getElementById('risk-class-title').textContent = `${this.selectedClass} Sınıfı Risk Haritası (${classStudents.length} Öğrenci)`;

    const tbody = document.getElementById('risk-table-body');
    if (!tbody) return;

    if (classStudents.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; color:var(--text-muted);">Bu şubede kayıtlı öğrenci bulunamadı.</td></tr>`;
      return;
    }

    tbody.innerHTML = classStudents.map(s => {
      const risks = s.riskFactors || [];
      const has = (r) => risks.some(x => x.toLowerCase().includes(r.toLowerCase())) ? '⚠️ Var' : '—';

      return `
        <tr>
          <td><strong>${escapeHtml(s.no || '-')}</strong></td>
          <td><strong>${escapeHtml(s.name)} ${escapeHtml(s.surname)}</strong></td>
          <td>${has('parçalanmış aile')}</td>
          <td>${has('başarısızlık')}</td>
          <td>${has('kaygı')}</td>
          <td>${s.specialNeeds ? '🔴 BEP' : '—'}</td>
          <td>
            <button class="header-btn" style="padding:4px 8px; font-size:12px;" onclick="window.studentsModule.showStudentDetail(${s.id})">İncele</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  printRiskMap() {
    const [level, branch] = this.selectedClass.split('-');
    window.appDB.getAll('students').then(students => {
      const classStudents = students.filter(s => s.classLevel === level && s.branch === branch);
      const printArea = document.getElementById('print-area');
      
      printArea.innerHTML = `
        <div class="meb-header">
          <h2>T.C. MİLLÎ EĞİTİM BAKANLIĞI</h2>
          <h3>ÇATALCA ANADOLU LİSESİ REHBERLİK VE PSİKOLOJİK DANIŞMA SERVİSİ</h3>
          <p><strong>${this.selectedClass} ŞUBESİ SINIF RİSK HARİTASI FORMU</strong></p>
        </div>

        <table class="print-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Adı Soyadı</th>
              <th>Parçalanmış Aile</th>
              <th>Akademik Başarısızlık</th>
              <th>Sınav Kaygısı</th>
              <th>Özel Eğitim / BEP</th>
              <th>Genel Değerlendirme</th>
            </tr>
          </thead>
          <tbody>
            ${classStudents.map(s => `
              <tr>
                <td>${escapeHtml(s.no || '-')}</td>
                <td>${escapeHtml(s.name)} ${escapeHtml(s.surname)}</td>
                <td>${(s.riskFactors || []).includes('Parçalanmış Aile') ? '+' : '-'}</td>
                <td>${(s.riskFactors || []).includes('Akademik Başarısızlık') ? '+' : '-'}</td>
                <td>${(s.riskFactors || []).includes('Sınav Kaygısı') ? '+' : '-'}</td>
                <td>${s.specialNeeds ? '+' : '-'}</td>
                <td>${escapeHtml(s.notes || '')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="signature-area">
          <div class="sign-box">
            <div class="role">Sınıf Rehber Öğretmeni</div>
            <div>İmza: ........................</div>
          </div>
          <div class="sign-box">
            <div class="role">Okul Rehberlik Öğretmeni / PDR</div>
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

window.classesModule = new ClassesModule();
