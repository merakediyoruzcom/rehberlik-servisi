/**
 * Rehberlik Servisi — Ajanda & Dashboard Modülü
 */

class AgendaModule {
  async render() {
    const today = new Date().toISOString().split('T')[0];
    const students = await window.appDB.getAll('students');
    const sessions = await window.appDB.getAll('sessions');
    const appointments = await window.appDB.getAll('appointments');
    const specialEdu = await window.appDB.getAll('specialEdu');

    // Bugün yapılan veya planlanan görüşmeler
    const todaySessions = sessions.filter(s => s.date === today);
    const todayAppts = appointments.filter(a => a.date === today);

    // İstatistik sayıları
    document.getElementById('stat-total-students').textContent = students.length;
    document.getElementById('stat-total-sessions').textContent = sessions.length;
    document.getElementById('stat-special-edu').textContent = specialEdu.length;
    document.getElementById('stat-today-agenda').textContent = todaySessions.length + todayAppts.length;

    // Günün Randevuları / İş Listesi
    const agendaListEl = document.getElementById('today-agenda-list');
    if (!agendaListEl) return;

    if (todaySessions.length === 0 && todayAppts.length === 0) {
      agendaListEl.innerHTML = `
        <div style="text-align:center; padding: 32px; color: var(--text-muted);">
          <div style="font-size:32px; margin-bottom:8px;">☕</div>
          <p>Bugün için henüz planlanmış bir randevu veya kayıtlı görüşme bulunmuyor.</p>
          <button class="header-btn primary" style="margin-top:12px;" onclick="window.app.openNewSessionModal()">+ Yeni Görüşme Başlat</button>
        </div>
      `;
    } else {
      let html = '<div style="display:flex; flex-direction:column; gap:10px;">';

      for (const a of todayAppts) {
        html += `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:#fff; border:1px solid var(--border-color); border-radius:10px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <span class="badge warning">Randevu</span>
              <div>
                <strong>${escapeHtml(a.targetName)}</strong>
                <div style="font-size:12px; color:var(--text-muted);">${escapeHtml(a.topic || 'Belirtilmedi')}</div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:13px; font-weight:600; color:var(--primary);">${a.time || '--:--'}</span>
              <button class="header-btn" onclick="window.app.startSessionFromAppt(${a.id})">Görüşmeye Başla</button>
            </div>
          </div>
        `;
      }

      for (const s of todaySessions) {
        html += `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:#fff; border:1px solid var(--border-color); border-radius:10px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <span class="badge success">Tamamlandı</span>
              <div>
                <strong>${escapeHtml(s.studentName)} (${escapeHtml(s.classBranch || '')})</strong>
                <div style="font-size:12px; color:var(--text-muted);">${escapeHtml(s.topic)}</div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:13px; font-weight:600; color:var(--text-muted);">${s.time || ''} (${s.duration || 30} dk)</span>
              <button class="header-btn" onclick="window.app.printSession(${s.id})">🖨️ Tutanak</button>
            </div>
          </div>
        `;
      }

      html += '</div>';
      agendaListEl.innerHTML = html;
    }

    // Son Yapılan Görüşmeler Tablosu
    const recentTableEl = document.getElementById('recent-sessions-table');
    if (recentTableEl) {
      const recent = [...sessions].reverse().slice(0, 6);
      if (recent.length === 0) {
        recentTableEl.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:24px;">Henüz görüşme kaydı bulunmuyor.</td></tr>`;
      } else {
        recentTableEl.innerHTML = recent.map(s => `
          <tr>
            <td><strong>${escapeHtml(s.studentName)}</strong></td>
            <td>${escapeHtml(s.classBranch || '-')}</td>
            <td><span class="badge info">${s.type === 'veli' ? 'Veli' : (s.type === 'ogretmen' ? 'Öğretmen' : 'Öğrenci')}</span></td>
            <td>${escapeHtml(s.topic)}</td>
            <td>${s.date} ${s.time ? s.time : ''}</td>
            <td>
              <button class="header-btn" style="padding:4px 8px; font-size:12px;" onclick="window.app.printSession(${s.id})">🖨️ Yazdır</button>
            </td>
          </tr>
        `).join('');
      }
    }
  }
}

window.agendaModule = new AgendaModule();
