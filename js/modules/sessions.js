/**
 * Rehberlik Servisi — Bireysel Görüşmeler Modülü
 * MEB e-Rehberlik Sistemi standartlarına tam uyumlu kodlama ve tutanak oluşturma
 */

class SessionsModule {
  constructor() {
    this.sessions = [];
  }

  async load() {
    this.sessions = await window.appDB.getAll('sessions');
    this.render();
  }

  render() {
    const tableBody = document.getElementById('sessions-table-body');
    if (!tableBody) return;

    if (this.sessions.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 36px; color:var(--text-muted);">
            Kayıtlı görüşme bulunmamaktadır.
          </td>
        </tr>
      `;
      return;
    }

    const list = [...this.sessions].reverse();

    tableBody.innerHTML = list.map(s => `
      <tr>
        <td><strong>${s.date}</strong> <span style="font-size:11.5px; color:var(--text-muted);">${s.time || ''}</span></td>
        <td>
          <div style="font-weight:600;">${escapeHtml(s.studentName)}</div>
          <div style="font-size:11px; color:var(--text-muted);">${escapeHtml(s.classBranch || '-')}</div>
        </td>
        <td><span class="badge info">${s.type === 'veli' ? 'Veli Görüşmesi' : (s.type === 'ogretmen' ? 'Öğretmen Görüşmesi' : 'Öğrenci Görüşmesi')}</span></td>
        <td>
          <div style="font-weight:500;">${escapeHtml(s.topic)}</div>
          <div style="font-size:11.5px; color:var(--primary);">${escapeHtml(s.mebCode || '')}</div>
        </td>
        <td>${s.duration || 30} dk</td>
        <td><span class="badge ${s.confidentiality === 'cok_gizli' ? 'danger' : 'success'}">${s.confidentiality === 'cok_gizli' ? 'Çok Gizli' : 'Standart'}</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="header-btn" style="padding:4px 8px; font-size:12px;" onclick="window.app.printSession(${s.id})">🖨️ Tutanak</button>
            <button class="header-btn" style="padding:4px 8px; font-size:12px; color:var(--danger);" onclick="window.sessionsModule.deleteSession(${s.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  async saveSessionFromForm() {
    const studentId = parseInt(document.getElementById('modal-session-student').value);
    const type = document.getElementById('modal-session-type').value;
    const date = document.getElementById('modal-session-date').value;
    const time = document.getElementById('modal-session-time').value;
    const duration = parseInt(document.getElementById('modal-session-duration').value) || 30;
    const mebCode = document.getElementById('modal-session-meb-code').value;
    const topic = document.getElementById('modal-session-topic').value.trim();
    const summary = document.getElementById('modal-session-summary').value.trim();
    const decisions = document.getElementById('modal-session-decisions').value.trim();
    const confidentiality = document.getElementById('modal-session-confidentiality').value;

    if (!studentId || !date || !topic) {
      alert('Lütfen öğrenci, tarih ve görüşme konusunu belirtiniz.');
      return;
    }

    const student = await window.appDB.get('students', studentId);
    if (!student) return;

    const newSession = {
      studentId,
      studentName: `${student.name} ${student.surname}`,
      classBranch: `${student.classLevel}-${student.branch}`,
      type,
      date,
      time,
      duration,
      mebCode,
      topic,
      summary,
      decisions,
      confidentiality,
      status: 'tamamlandi'
    };

    await window.appDB.add('sessions', newSession);
    window.app.closeModal('new-session-modal');
    await this.load();
    if (window.agendaModule) window.agendaModule.render();
    window.app.showToast('Görüşme kaydı başarıyla eklendi.');
  }

  async deleteSession(id) {
    if (confirm('Bu görüşme kaydını silmek istediğinize emin misiniz?')) {
      await window.appDB.delete('sessions', id);
      await this.load();
      if (window.agendaModule) window.agendaModule.render();
      window.app.showToast('Görüşme silindi.');
    }
  }
}

window.sessionsModule = new SessionsModule();
