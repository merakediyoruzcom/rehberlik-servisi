/**
 * Rehberlik Servisi — Ayarlar & Yedekleme Modülü
 */

class SettingsModule {
  async load() {
    const profile = await window.appDB.getSetting('school_profile') || {};
    document.getElementById('set-school-name').value = profile.schoolName || '';
    document.getElementById('set-counselor-name').value = profile.counselorName || '';
    document.getElementById('set-academic-year').value = profile.academicYear || '2026-2027';
  }

  async saveProfile() {
    const schoolName = document.getElementById('set-school-name').value.trim();
    const counselorName = document.getElementById('set-counselor-name').value.trim();
    const academicYear = document.getElementById('set-academic-year').value.trim();

    await window.appDB.setSetting('school_profile', {
      schoolName,
      counselorName,
      academicYear
    });

    document.getElementById('header-school-name').textContent = schoolName;
    window.app.showToast('Kurum ayarları kaydedildi.');
  }

  async exportBackup() {
    await window.appDB.exportAllData();
    window.app.showToast('Yedek dosyası (.json) bilgisayarınıza indirildi.');
  }

  async importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (confirm('Mevcut veriler silinip yedekteki veriler yüklenecek. Devam edilsin mi?')) {
        await window.appDB.importAllData(json);
        alert('Yedek başarıyla geri yüklendi! Sayfa yenileniyor...');
        location.reload();
      }
    } catch (err) {
      alert('Yedek dosyası yüklenirken hata oluştu: ' + err.message);
    }
  }

  async clearAllData() {
    if (confirm('DİKKAT: Tüm öğrenci ve görüşme kayıtları silinecek! Bu işlem geri alınamaz. Emin misiniz?')) {
      const pass = prompt('İşlemi onaylamak için "SIFIRLA" yazınız:');
      if (pass === 'SIFIRLA') {
        const dbs = ['students', 'sessions', 'appointments', 'specialEdu', 'groups'];
        for (const s of dbs) {
          const tx = window.appDB.db.transaction([s], 'readwrite');
          tx.objectStore(s).clear();
        }
        alert('Tüm veriler temizlendi.');
        location.reload();
      }
    }
  }
}

window.settingsModule = new SettingsModule();
