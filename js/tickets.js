/**
 * EPL Matchday Gate - Digital Tickets Script
 * تذكرتي دوري نايل - التذكرة الرقمية والبوابة الإلكترونية
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Load Booking Data
  const ticket = getActiveBooking();

  // Populate dynamic ticket elements
  const refBadge = document.getElementById('ticketReferenceBadge');
  const gateVal = document.getElementById('ticketGateVal');
  const gateSub = document.getElementById('ticketGateSub');
  const sectorVal = document.getElementById('ticketSectorVal');
  const sectorSub = document.getElementById('ticketSectorSub');
  const blockVal = document.getElementById('ticketBlockVal');
  const seatVal = document.getElementById('ticketSeatVal');
  const fanNameVal = document.getElementById('ticketFanNameVal');
  const fanIdVal = document.getElementById('ticketFanIdVal');
  const matchTitleVal = document.getElementById('ticketMatchTitleVal');

  if (refBadge && ticket.reference) refBadge.textContent = ticket.reference;
  if (gateVal && ticket.gate) gateVal.textContent = ticket.gate.split('(')[0].trim() || 'بوابة 5';
  if (gateSub && ticket.gate) gateSub.textContent = ticket.gate.includes('(') ? ticket.gate.split('(')[1].replace(')', '') : 'المدخل الرئيسي';
  if (sectorVal && ticket.sector) sectorVal.textContent = ticket.sector.split('(')[0].trim() || 'الدرجة الثالثة شمال';
  if (sectorSub && ticket.sector) sectorSub.textContent = ticket.club ? `مدرج جماهير ${ticket.club}` : 'مدرج المشجعين';
  if (blockVal && ticket.block) blockVal.textContent = `${ticket.block} • ${ticket.row || 'صف 8'}`;
  if (seatVal && ticket.seat) seatVal.textContent = ticket.seat;
  if (fanNameVal && ticket.fanName) fanNameVal.textContent = ticket.fanName;
  if (fanIdVal && ticket.fanId) fanIdVal.textContent = ticket.fanId;
  if (matchTitleVal && ticket.matchTitle) matchTitleVal.textContent = ticket.matchTitle;

  // 2. Real-Time Moving Security Pass Clock
  function updatePassClock() {
    const timestampEl = document.getElementById('liveTimestamp');
    if (!timestampEl) return;
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    timestampEl.textContent = `${hrs}:${mins}:${secs} • رمز مشفر ومتحرك`;
  }
  setInterval(updatePassClock, 1000);
  updatePassClock();

  // 3. Download PDF / Print Ticket Action
  const downloadBtn = document.getElementById('downloadPdfBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const originalText = downloadBtn.innerHTML;
      downloadBtn.innerHTML = '<span class="material-symbols-outlined text-lg animate-spin">refresh</span><span>جاري التحميل...</span>';
      setTimeout(() => {
        downloadBtn.innerHTML = originalText;
        showToast('تم تجهيز التذكرة للطباعة / الحفظ بتنسيق PDF', 'success');
        window.print();
      }, 700);
    });
  }

  // 4. Share Pass Action
  const shareBtn = document.getElementById('sharePassBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareData = {
        title: `تذكرة ${ticket.matchTitle || 'مباراة القمة'} - تذكرتي`,
        text: `تذكرتي الرسمية المعتمدة لحضور مباراة ${ticket.matchTitle} باستاد القاهرة الدولي - مقعد ${ticket.seat || '42'}`,
        url: window.location.href,
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('تم نسخ رابط التذكرة الرقمية إلى الحافظة بنجاح', 'success');
        });
      }
    });
  }

  // 5. Digital Wallets
  const appleWalletBtn = document.getElementById('appleWalletBtn');
  const googleWalletBtn = document.getElementById('googleWalletBtn');

  if (appleWalletBtn) {
    appleWalletBtn.addEventListener('click', () => {
      showToast('تمت إضافة بطاقة المباراة إلى Apple Wallet جاهزة للعبور بـ NFC', 'success');
    });
  }

  if (googleWalletBtn) {
    googleWalletBtn.addEventListener('click', () => {
      showToast('تمت إضافة بطاقة المباراة إلى Google Wallet بنجاح', 'success');
    });
  }

  // 6. WhatsApp & SMS
  const whatsappBtn = document.getElementById('whatsappBtn');
  const smsBtn = document.getElementById('smsBtn');

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const text = encodeURIComponent(`مرحباً، هذه تذكرتي المعتمدة لمباراة ${ticket.matchTitle} في استاد القاهرة الدولي. رقم الحجز: ${ticket.reference}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });
  }

  if (smsBtn) {
    smsBtn.addEventListener('click', () => {
      showToast('تم إرسال تفاصيل التذكرة وكود الدخول السريع في رسالة SMS لهاتفك المسجل', 'success');
    });
  }

  // 7. Field Support Help Call
  const helpBtn = document.getElementById('fieldHelpBtn');
  if (helpBtn) {
    helpBtn.addEventListener('click', () => {
      showToast('تم إرسال إشعار لمنظمي بوابة الاستاد. سيصلك ممثل الخدمة الميدانية خلال دقائق.', 'info');
    });
  }
});
