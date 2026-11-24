/**
 * Rehberlik Servisi — Yerel Veritabanı Katmanı (IndexedDB + LocalStorage Fallback)
 * Tüm veriler %100 yerel olarak kullanıcının tarayıcısında saklanır.
 */

const DB_NAME = 'RehberlikServisiNetDB';
const DB_VERSION = 3;

class Database {
  constructor() {
    this.db = null;
    this.isReady = false;
  }

  async init() {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;

          // Öğrenciler tablosu
          if (!db.objectStoreNames.contains('students')) {
            const studentStore = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
            studentStore.createIndex('no', 'no', { unique: false });
            studentStore.createIndex('name', 'name', { unique: false });
          }

          // Bireysel Görüşmeler tablosu
          if (!db.objectStoreNames.contains('sessions')) {
            const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
            sessionStore.createIndex('studentId', 'studentId', { unique: false });
            sessionStore.createIndex('date', 'date', { unique: false });
          }

          // Randevular & Ajanda tablosu
          if (!db.objectStoreNames.contains('appointments')) {
            db.createObjectStore('appointments', { keyPath: 'id', autoIncrement: true });
          }

          // Grup Çalışmaları tablosu
          if (!db.objectStoreNames.contains('groups')) {
            db.createObjectStore('groups', { keyPath: 'id', autoIncrement: true });
          }

          // Özel Eğitim & BEP tablosu
          if (!db.objectStoreNames.contains('specialEdu')) {
            db.createObjectStore('specialEdu', { keyPath: 'id', autoIncrement: true });
          }

          // Eylem Planları ve Projeler tablosu
          if (!db.objectStoreNames.contains('eylemProjeler')) {
            db.createObjectStore('eylemProjeler', { keyPath: 'id', autoIncrement: true });
          }

          // Ayarlar & Okul Profili tablosu
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
        };

        request.onsuccess = async (event) => {
          this.db = event.target.result;
          this.isReady = true;
          try {
            await this.checkInitialSettings();
          } catch (e) {
            console.warn('İlk ayarlar yüklenirken hata:', e);
          }
          resolve(this.db);
        };

        request.onerror = (event) => {
          console.error('IndexedDB açılamadı:', event.target.error);
          this.isReady = true;
          resolve(null);
        };

        request.onblocked = () => {
          console.warn('IndexedDB engellendi, lütfen açık diğer sekmeleri kapatın.');
          resolve(null);
        };
      } catch (err) {
        console.error('IndexedDB genel hata:', err);
        this.isReady = true;
        resolve(null);
      }
    });
  }

  // Varsayılan kurum ayarlarını kontrol et ve yükle
  async checkInitialSettings() {
    const existing = await this.getSetting('school_profile');
    if (!existing) {
      await this.setSetting('school_profile', {
        schoolName: 'Çatalca Anadolu Lisesi',
        counselorName: 'Rehberlik ve Psikolojik Danışma Servisi',
        academicYear: '2026-2027',
        phone: '',
        email: ''
      });
    }

    const studentCount = await this.count('students');
    if (studentCount === 0) {
      await this.seedSampleData();
    }
  }

  // Örnek başlangıç verileri
  async seedSampleData() {
    const sampleStudents = [
      {
        no: '101',
        name: 'Ahmet',
        surname: 'Yılmaz',
        gender: 'Erkek',
        classLevel: '9',
        branch: 'A',
        parentName: 'Mehmet Yılmaz (Baba)',
        parentPhone: '0555 123 4567',
        riskFactors: ['Parçalanmış Aile', 'Akademik Başarısızlık'],
        specialNeeds: false,
        notes: 'Ders çalışma programı talep etti.'
      },
      {
        no: '204',
        name: 'Zeynep',
        surname: 'Kaya',
        gender: 'Kız',
        classLevel: '10',
        branch: 'B',
        parentName: 'Fatma Kaya (Anne)',
        parentPhone: '0555 987 6543',
        riskFactors: ['Sınav Kaygısı'],
        specialNeeds: false,
        notes: 'Sınav öncesi heyecan ve odaklanma güçlüğü yaşıyor.'
      },
      {
        no: '315',
        name: 'Emre',
        surname: 'Demir',
        gender: 'Erkek',
        classLevel: '11',
        branch: 'A',
        parentName: 'Ali Demir (Baba)',
        parentPhone: '0555 456 7890',
        riskFactors: ['Özel Eğitim / Kaynaştırma'],
        specialNeeds: true,
        ramReport: 'Özgül Öğrenme Güçlüğü (Diskalkuli) - BEP Planlandı',
        notes: 'RAM raporu 2026-2027 yılı geçerli.'
      },
      {
        no: '412',
        name: 'Elif',
        surname: 'Aydın',
        gender: 'Kız',
        classLevel: '12',
        branch: 'B',
        parentName: 'Ayşe Aydın (Anne)',
        parentPhone: '0555 321 0987',
        riskFactors: ['YKS Hedef Belirleme'],
        specialNeeds: false,
        notes: 'Sayısal alan tercihleri ve YKS net takip görüşmesi yapıldı.'
      }
    ];

    for (const st of sampleStudents) {
      const stId = await this.add('students', st);
      if (st.specialNeeds) {
        await this.add('specialEdu', {
          studentId: stId,
          studentName: `${st.name} ${st.surname}`,
          diagnosis: 'Özgül Öğrenme Güçlüğü',
          ramDate: '2026-09-15',
          bepDate: '2026-10-01',
          supportRoom: true,
          notes: 'Destek eğitim odasında matematik dersi alıyor.'
        });
      }
    }

    // Örnek Bireysel Görüşmeler
    await this.add('sessions', {
      studentId: 1,
      studentName: 'Ahmet Yılmaz',
      classBranch: '9-A',
      type: 'ogrenci',
      date: new Date().toISOString().split('T')[0],
      time: '10:30',
      duration: 35,
      mebCode: 'Gelişimsel / Akademik Gelişim',
      topic: 'Verimli Ders Çalışma ve Zaman Yönetimi',
      summary: 'Öğrencinin haftalık ders çalışma alışkanlıkları incelendi, haftalık çalışma çizelgesi hazırlandı.',
      decisions: '2 hafta sonra çalışma çizelgesi sonuçları tekrar değerlendirilecek.',
      confidentiality: 'normal',
      status: 'tamamlandi'
    });

    await this.add('sessions', {
      studentId: 2,
      studentName: 'Zeynep Kaya',
      classBranch: '10-B',
      type: 'ogrenci',
      date: new Date().toISOString().split('T')[0],
      time: '13:45',
      duration: 40,
      mebCode: 'Önleyici / Sınav Kaygısı',
      topic: 'Sınav Kaygısıyla Başa Çıkma ve Nefes Egzersizleri',
      summary: 'Öğrencinin sınav kaygısı düzeyleri ele alındı, olumsuz otomatik düşünceler çalışıldı.',
      decisions: 'Gevşeme egzersizleri uygulaması önerildi, takip görüşmesi planlandı.',
      confidentiality: 'normal',
      status: 'tamamlandi'
    });

    // Örnek Randevular
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await this.add('appointments', {
      targetName: 'Mehmet Yılmaz (Veli - Ahmet Yılmaz)',
      targetType: 'veli',
      date: tomorrow.toISOString().split('T')[0],
      time: '11:00',
      topic: 'Akademik Başarı ve Aile İçi İletişim',
      status: 'bekliyor'
    });
  }

  // Genel CRUD Metotları
  async add(storeName, data) {
    if (!this.db) return null;
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.add(data);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  async update(storeName, data) {
    if (!this.db) return null;
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(data);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  async delete(storeName, id) {
    if (!this.db) return null;
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  async get(storeName, id) {
    if (!this.db) return null;
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([storeName], 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  async getAll(storeName) {
    if (!this.db) return [];
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async count(storeName) {
    if (!this.db) return 0;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.count();
        req.onsuccess = () => resolve(req.result || 0);
        req.onerror = () => resolve(0);
      } catch (e) {
        resolve(0);
      }
    });
  }

  // Ayarlar
  async getSetting(key) {
    const res = await this.get('settings', key);
    return res ? res.value : null;
  }

  async setSetting(key, value) {
    return this.update('settings', { key, value });
  }

  // Tam Yedekleme (Tüm Veritabanını JSON Olarak İndir)
  async exportAllData() {
    const stores = ['students', 'sessions', 'appointments', 'groups', 'specialEdu', 'settings'];
    const backup = {
      version: '1.0',
      appName: 'Rehberlik Servisi',
      exportDate: new Date().toISOString(),
      data: {}
    };

    for (const s of stores) {
      backup.data[s] = await this.getAll(s);
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `rehberlikservisi_yedek_${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  }

  // Yedekten Geri Yükleme
  async importAllData(jsonData) {
    if (!jsonData || !jsonData.data) throw new Error('Geçersiz yedek dosyası formatı!');
    const stores = ['students', 'sessions', 'appointments', 'groups', 'specialEdu', 'settings'];

    for (const s of stores) {
      if (jsonData.data[s] && Array.isArray(jsonData.data[s])) {
        const tx = this.db.transaction([s], 'readwrite');
        const store = tx.objectStore(s);
        store.clear();
        for (const item of jsonData.data[s]) {
          store.add(item);
        }
      }
    }
    return true;
  }
}

// Global Veritabanı Örneği
window.appDB = new Database();
