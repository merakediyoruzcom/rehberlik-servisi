# 🏫 Rehberlik Servisi

> **Devlet okulları ve rehberlik servisleri için %100 yerel, ücretsiz, kurulum gerektirmeyen ve MEB e-Rehberlik uyumlu dijital PDR yönetim sistemi.**

[![Lisans: MIT](https://img.shields.io/badge/Lisans-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20%C3%87evrimd%C4%B1%C5%9F%C4%B1%20(Offline)-success)](#)
[![KVKK Uyumlu](https://img.shields.io/badge/Gizlilik-KVKK%20%25100%20Yerel-brightgreen)](#)
[![Kurulumsuz](https://img.shields.io/badge/Kurulum-Gerektirmez-orange)](#)

---

## 🌟 Neden Rehberlik Servisi?

* **🔒 %100 Çevrimdışı (Offline-First) & KVKK Güvencesi:** Öğrenci görüşme notları, aile sırları ve hassas bilgiler **asla internete veya bir sunucuya gitmez**. Tüm veriler sadece kullanılan bilgisayarın tarayıcı önbelleğinde (`IndexedDB`) saklanır.
* **🚀 Kurulumsuz & Virüssüz:** Bilgisayara `.exe` dosyası kurmak gerekmez. Okul bilgisayarlarındaki MEB idari engellerine ve antivirüs uyarılarına takılmaz; `index.html` dosyasına çift tıklanarak doğrudan Google Chrome veya Edge içinde açılır.
* **💸 Tamamen Ücretsiz:** Sunucu, hosting veya abonelik ücreti yoktur. Devlet okullarındaki tüm psikolojik danışman ve rehber öğretmenler ömür boyu ücretsiz kullanabilir.
* **📋 MEB e-Rehberlik Standartlarına Tam Uyumlu:** Faaliyet alanları, hizmet kodları, resmi formlar ve kurul tutanakları güncel MEB PDR mevzuatına göre hazırlanmıştır.

---

## 📂 İçerdiği Modüller

### 1. 👥 Öğrenci & Görüşme
* **Öğrenci Dosyası:** Arama, sınıf/şube filtreleri, künye, veli iletişim bilgileri ve geçmiş görüşme arşivi.
* **Bireysel Görüşmeler:** MEB e-Rehberlik kodları (Gelişimsel, Önleyici, İyileştirici, Destek), görüşme özeti, gizlilik düzeyi ve tek tıkla **Resmi A4 Görüşme Tutanağı** yazdırma.
* **Özel Eğitim & BEP:** Kaynaştırma/bütünleştirme öğrencileri, RAM eğitsel değerlendirme tarihleri, BEP ve Destek Eğitim Odası takibi.
* **Sınıf Bilgisi & Risk Haritası:** Sınıf listeleri ve MEB standartlarında otomatik **Sınıf Risk Haritası** oluşturma ve A4 yazdırma.

### 2. 📅 Planlama & Kaynak
* **Ajanda:** Günlük randevular, bekleyen görüşmeler ve anlık gösterge sayaçları.
* **Eylem Planı ve Proje:** Okul Bağımlılıkla Mücadele (TBM), Şiddeti Önleme, Kariyer Günleri vb. eylem planları, iş akışları ve görev tamamlama çubukları.
* **Yıllık Rehberlik Faaliyetleri:** MEB Genel, Yerel ve Özel Hedefleri ile aylık çalışma takvimi.
* **Kurul, Komisyon ve Toplantılar:** RHYK (Rehberlik Hizmetleri Yürütme Komisyonu), BEP Birimi ve ŞÖK karar ve toplantı tutanakları.
* **Mevzuat Kütüphanesi:** MEB PDR Yönetmeliği, Özel Eğitim Hizmetleri Yönetmeliği ve Çocuk Koruma Kanunu maddeleri çevrimdışı rehberi.

### 3. 📊 Kayıt & Rapor
* **Form ve Belge:** MEB Desimal Dosya Sistemi (805.01 vb.) şablonları, RİBA, Sosyometri ve anket formları.
* **Notlar:** Hızlı yapışkan notlar ve günlük hatırlatıcılar.
* **İstatistik & Raporlar:** e-Rehberlik faaliyet alanı dağılım grafikleri ve resmi dönem sonu çalışma raporu.
* **Yedekleme & Geri Yükleme:** Tek tıkla tüm verileri `.json` olarak bilgisayara indirme ve başka bilgisayara aktarabilme.

---

## 🖥️ Nasıl Kullanılır?

### Yöntem 1: Doğrudan Bilgisayarda Çevrimdışı Çalıştırma (En Kolayı)
1. Bu depoyu sağ üstteki yeşil **`Code -> Download ZIP`** butonuna basarak indirin.
2. İndirdiğiniz ZIP dosyasını klasöre çıkartın.
3. Klasörün içindeki **`index.html`** dosyasına çift tıklayın.
4. Programınız Google Chrome veya Edge üzerinde internetsiz olarak anında açılacaktır!

### Yöntem 2: GitHub Pages ile Canlı Kullanım (Web Üzerinden)
Bu projeyi GitHub Pages üzerinden de tek tıkla çalıştırabilirsiniz:
1. Deponuzun **Settings -> Pages** sekmesine gidin.
2. `Branch` kısmından `main` (veya `master`) seçip `/ (root)` olarak kaydedin.
3. GitHub size bir bağlantı verecektir (ör. `https://kullaniciadi.github.io/rehberlik-servisi`).
4. Bu bağlantıya tıkladığınızda sistem tarayıcınızda açılır. **Tüm veriler yine kullanıcının kendi bilgisayarında saklanır.**

---

## 🔒 Güvenlik ve Gizlilik İlkesi

Bu yazılım **KVKK (Kişisel Verilerin Korunması Kanunu)** ilkeleri gözetilerek mimarilendirilmiştir:
* Hiçbir harici sunucuya veri göndermez.
* Çerez (cookie) veya takip kodu (analytics) içermez.
* Bilgisayar formatlandığında verilerin kaybolmaması için **Ayarlar** menüsünden düzenli olarak **JSON Yedeği** alınması önerilir.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır. Eğitim kurumları, öğretmenler ve geliştiriciler tarafından serbestçe kullanılabilir, geliştirilebilir ve dağıtılabilir.
