/**
 * Rehberlik Servisi — Notlar ve Hatırlatmalar Modülü
 */

class NotesModule {
  constructor() {
    this.notes = [
      { id: 1, text: '12-A sınıfı için TYT Türkçe net analizleri cuma gününe kadar tamamlanacak.', date: '12 Ekim 2026', color: '#fef3c7' },
      { id: 2, text: 'RAM randevusu olan Emre Demir\'in velisi saat 14:00\'te servise davet edildi.', date: '11 Ekim 2026', color: '#ecfdf5' },
      { id: 3, text: 'İlçe MEM Şiddeti Önleme Eylem Planı 1. dönem verileri sisteme girilecek.', date: '10 Ekim 2026', color: '#f3e8ff' }
    ];
  }

  render() {
    const container = document.getElementById('notes-grid-container');
    if (!container) return;

    container.innerHTML = this.notes.map(n => `
      <div style="background:${n.color}; border:1px solid rgba(0,0,0,0.08); border-radius:12px; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,0.02); display:flex; flex-direction:column; justify-content:space-between; min-height:140px;">
        <p style="font-size:13.5px; color:#1e293b; line-height:1.5;">${escapeHtml(n.text)}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:#64748b; margin-top:12px; border-top:1px dashed rgba(0,0,0,0.1); padding-top:8px;">
          <span>📌 ${n.date}</span>
          <button style="background:none; border:none; cursor:pointer; color:#ef4444;" onclick="window.notesModule.deleteNote(${n.id})">Sil</button>
        </div>
      </div>
    `).join('');
  }

  addNote() {
    const text = prompt('Yeni notunuzu giriniz:');
    if (!text || !text.trim()) return;

    const colors = ['#fef3c7', '#ecfdf5', '#f3e8ff', '#e0f2fe'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const today = new Date().toLocaleDateString('tr-TR');

    this.notes.unshift({
      id: Date.now(),
      text: text.trim(),
      date: today,
      color: randomColor
    });

    this.render();
  }

  deleteNote(id) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.render();
  }
}

window.notesModule = new NotesModule();
