/**
 * Rehberlik Servisi — Özel Eğitim, BEP ve RAM Takip Modülü
 */

class SpecialEduModule {
  async load() {
    const list = await window.appDB.getAll('specialEdu');
    this.render(list);
  }

  render(list) {
    const tbody = document.getElementById('special-edu-table-body');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:36px; color:var(--text-muted);">
            Kayıtlı özel eğitim / kaynaştırma öğrencisi bulunmuyor.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(item => `
      <tr>
        <td><strong>${escapeHtml(item.studentName)}</strong></td>
        <td><span class="badge danger">${escapeHtml(item.diagnosis || 'Tanılanmamış')}</span></td>
        <td>${escapeHtml(item.ramDate || 'Belirtilmedi')}</td>
        <td>${escapeHtml(item.bepDate || 'Belirtilmedi')}</td>
        <td><span class="badge ${item.supportRoom ? 'success' : 'warning'}">${item.supportRoom ? 'Faydalanıyor' : 'Faydalanmıyor'}</span></td>
        <td>${escapeHtml(item.notes || '-')}</td>
        <td>
          <button class="header-btn" style="padding:4px 8px; font-size:12px;" onclick="window.studentsModule.showStudentDetail(${item.studentId})">Dosya</button>
        </td>
      </tr>
    `).join('');
  }
}

window.specialEduModule = new SpecialEduModule();
