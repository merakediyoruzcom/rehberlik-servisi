/**
 * Rehberlik Servisi — Öğrenci Yönetimi Modülü
 */

class StudentsModule {
  constructor() {
    this.students = [];
    this.currentFilter = {
      search: '',
      classLevel: '',
      branch: ''
    };
  }

  async load() {
    this.students = await window.appDB.getAll('students');
    this.render();
  }

  render() {
    const listEl = document.getElementById('students-table-body');
    if (!listEl) return;

    let filtered = this.students.filter(s => {
      const q = this.currentFilter.search.toLowerCase();
      const matchSearch = !q || 
        s.name.toLowerCase().includes(q) || 
        s.surname.toLowerCase().includes(q) || 
        (s.no && s.no.toString().includes(q));
      
      const matchClass = !this.currentFilter.classLevel || s.classLevel === this.currentFilter.classLevel;
      const matchBranch = !this.currentFilter.branch || s.branch === this.currentFilter.branch;

      return matchSearch && matchClass && matchBranch;
    });

    document.getElementById('student-count-badge').textContent = `${filtered.length} Öğrenci`;

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 36px; color:var(--text-muted);">
            Kriterlere uygun öğrenci bulunamadı.
          </td>
        </tr>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(s => {
      const risks = (s.riskFactors || []).map(r => `<span class="badge warning" style="margin-right:4px;">${escapeHtml(r)}</span>`).join('');
      const specialBadge = s.specialNeeds ? `<span class="badge danger">Özel Eğitim</span>` : '';

      return `
        <tr>
          <td><strong>${escapeHtml(s.no || '-')}</strong></td>
          <td>
            <div style="font-weight:600; color:var(--text-main);">${escapeHtml(s.name)} ${escapeHtml(s.surname)}</div>
            <div style="font-size:11px; color:var(--text-muted);">${escapeHtml(s.gender || '')}</div>
          </td>
          <td><span class="badge info">${escapeHtml(s.classLevel)}-${escapeHtml(s.branch)}</span></td>
          <td>
            <div>${escapeHtml(s.parentName || '-')}</div>
            <div style="font-size:11.5px; color:var(--text-muted);">${escapeHtml(s.parentPhone || '')}</div>
          </td>
          <td>${risks || '-'} ${specialBadge}</td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="header-btn" style="padding:4px 8px; font-size:12px;" onclick="window.studentsModule.showStudentDetail(${s.id})" title="Öğrenci Dosyası">📁 Dosya</button>
              <button class="header-btn primary" style="padding:4px 8px; font-size:12px;" onclick="window.app.openNewSessionModalForStudent(${s.id})" title="Görüşme Başlat">💬 Görüş</button>
              <button class="header-btn" style="padding:4px 8px; font-size:12px; color:var(--danger);" onclick="window.studentsModule.deleteStudent(${s.id})" title="Sil">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  setSearch(q) {
    this.currentFilter.search = q;
    this.render();
  }

  setClassFilter(level, branch) {
    this.currentFilter.classLevel = level;
    this.currentFilter.branch = branch;
    this.render();
  }

  async showStudentDetail(id) {
    const student = await window.appDB.get('students', id);
    if (!student) return;

    const allSessions = await window.appDB.getAll('sessions');
    const studentSessions = allSessions.filter(s => s.studentId === id);

    const modalBody = document.getElementById('student-detail-modal-body');
    modalBody.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border-color);">
        <div>
          <h2 style="font-size:20px; font-weight:700;">${escapeHtml(student.name)} ${escapeHtml(student.surname)}</h2>
          <p style="color:var(--text-muted); font-size:13px; margin-top:2px;">
            Okul No: <strong>${escapeHtml(student.no || '-')}</strong> | Sınıf: <strong>${student.classLevel}-${student.branch}</strong> | Cinsiyet: <strong>${student.gender || '-'}</strong>
          </p>
        </div>
        <span class="badge ${student.specialNeeds ? 'danger' : 'success'}" style="font-size:13px; padding:6px 12px;">
          ${student.specialNeeds ? 'Özel Eğitim / Kaynaştırma' : 'Genel Gelişim'}
        </span>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
        <div style="background:#f8fafc; padding:14px; border-radius:8px;">
          <h4 style="font-size:13px; font-weight:700; margin-bottom:8px; color:var(--primary);">👨‍👩‍👧 Aile & Veli Bilgileri</h4>
          <p style="font-size:13px; margin-bottom:4px;"><strong>Veli:</strong> ${escapeHtml(student.parentName || 'Belirtilmedi')}</p>
          <p style="font-size:13px; margin-bottom:4px;"><strong>Telefon:</strong> ${escapeHtml(student.parentPhone || 'Belirtilmedi')}</p>
          <p style="font-size:13px;"><strong>Risk Faktörleri:</strong> ${(student.riskFactors || []).join(', ') || 'Yok'}</p>
        </div>

        <div style="background:#f8fafc; padding:14px; border-radius:8px;">
          <h4 style="font-size:13px; font-weight:700; margin-bottom:8px; color:var(--primary);">📝 Danışman Notları & RAM</h4>
          <p style="font-size:13px; margin-bottom:4px;"><strong>RAM Raporu:</strong> ${escapeHtml(student.ramReport || 'Yok')}</p>
          <p style="font-size:13px;"><strong>Özel Not:</strong> ${escapeHtml(student.notes || 'Not eklenmemiş')}</p>
        </div>
      </div>

      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="font-size:15px; font-weight:700;">Görüşme Geçmişi (${studentSessions.length})</h3>
          <button class="header-btn primary" style="font-size:12px; padding:4px 10px;" onclick="window.app.closeModal('student-detail-modal'); window.app.openNewSessionModalForStudent(${student.id});">+ Yeni Görüşme</button>
        </div>

        ${studentSessions.length === 0 ? `
          <p style="color:var(--text-muted); font-size:13px; padding:16px; text-align:center; background:#fafafa; border-radius:8px;">Bu öğrenciyle henüz kayıtlı görüşme yapılmamış.</p>
        ` : `
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${studentSessions.map(s => `
              <div style="border:1px solid var(--border-color); padding:10px 14px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:600; font-size:13.5px;">${escapeHtml(s.topic)}</div>
                  <div style="font-size:12px; color:var(--text-muted);">${s.date} | Kod: ${escapeHtml(s.mebCode || '-')}</div>
                </div>
                <button class="header-btn" style="font-size:12px; padding:3px 8px;" onclick="window.app.printSession(${s.id})">🖨️ Yazdır</button>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    window.app.openModal('student-detail-modal');
  }

  async saveStudentFromForm() {
    const name = document.getElementById('modal-st-name').value.trim();
    const surname = document.getElementById('modal-st-surname').value.trim();
    const no = document.getElementById('modal-st-no').value.trim();
    const classLevel = document.getElementById('modal-st-class').value;
    const branch = document.getElementById('modal-st-branch').value;
    const gender = document.getElementById('modal-st-gender').value;
    const parentName = document.getElementById('modal-st-parent-name').value.trim();
    const parentPhone = document.getElementById('modal-st-parent-phone').value.trim();
    const specialNeeds = document.getElementById('modal-st-special').checked;
    const notes = document.getElementById('modal-st-notes').value.trim();

    if (!name || !surname || !classLevel || !branch) {
      alert('Lütfen ad, soyad, sınıf ve şube alanlarını doldurunuz.');
      return;
    }

    const newStudent = {
      name,
      surname,
      no,
      classLevel,
      branch,
      gender,
      parentName,
      parentPhone,
      specialNeeds,
      notes,
      riskFactors: []
    };

    // Risk faktörleri checkbox'ları
    const riskCheckboxes = document.querySelectorAll('.risk-cb:checked');
    riskCheckboxes.forEach(cb => newStudent.riskFactors.push(cb.value));

    await window.appDB.add('students', newStudent);
    window.app.closeModal('new-student-modal');
    await this.load();
    window.app.showToast('Öğrenci başarıyla kaydedildi.');
  }

  async deleteStudent(id) {
    if (confirm('Bu öğrenciyi ve tüm kayıtlarını silmek istediğinize emin misiniz?')) {
      await window.appDB.delete('students', id);
      await this.load();
      window.app.showToast('Öğrenci silindi.');
    }
  }
}

window.studentsModule = new StudentsModule();
