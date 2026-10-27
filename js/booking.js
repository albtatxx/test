/**
 * EPL Matchday Gate - Stadium Booking Page Script
 * تذكرتي دوري نايل - منطق حجز المقاعد واختيار المدرجات
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentTicketPrice = 75;
  const serviceFee = 10;
  let quantity = 1;
  let remainingSeconds = 9 * 60 + 45; // 09:45
  const totalSessionSeconds = 12 * 60;

  // Selected State
  let selectedSectorName = "الدرجة الثالثة شمال (جماهير الأهلي)";
  let selectedGate = "بوابة 4 و 5 (شارع صلاح سالم)";
  let selectedBlock = "بلوك 14";
  let selectedRow = "صف C";
  let selectedSeatNum = "42";
  let matchName = "الأهلي vs الزمالك";

  // Check URL params for match query
  const urlParams = new URLSearchParams(window.location.search);
  const matchParam = urlParams.get('match');
  if (matchParam) {
    if (matchParam.includes('pyramids')) {
      matchName = "بيراميدز vs الإسماعيلي";
      const matchHeader = document.getElementById('match-header-title');
      if (matchHeader) matchHeader.innerHTML = 'بيراميدز <span class="text-secondary font-bold">vs</span> الإسماعيلي';
    } else if (matchParam.includes('masry')) {
      matchName = "المصري vs سموحة";
      const matchHeader = document.getElementById('match-header-title');
      if (matchHeader) matchHeader.innerHTML = 'المصري <span class="text-secondary font-bold">vs</span> سموحة';
    } else if (matchParam.includes('ittihad')) {
      matchName = "الاتحاد السكندري vs زد إف سي";
      const matchHeader = document.getElementById('match-header-title');
      if (matchHeader) matchHeader.innerHTML = 'الاتحاد السكندري <span class="text-secondary font-bold">vs</span> زد إف سي';
    }
  }

  // DOM Elements
  const countdownDisplay = document.getElementById('countdown-display');
  const countdownBar = document.getElementById('countdown-bar');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyCount = document.getElementById('qty-count');
  const calcQty = document.getElementById('calc-qty');
  const calcBasePrice = document.getElementById('calc-base-price');
  const calcTotalPrice = document.getElementById('calc-total-price');
  const ctaButtonText = document.getElementById('cta-button-text');
  const secondaryFanWrapper = document.getElementById('secondary-fan-wrapper');
  const verifySecondaryBtn = document.getElementById('verify-secondary-btn');
  const secondaryStatusMsg = document.getElementById('secondary-status-msg');
  const summarySector = document.getElementById('summary-sector');
  const summarySeat = document.getElementById('summary-seat');
  const summaryGate = document.getElementById('summary-gate');
  const matrixSectorTitle = document.getElementById('matrix-sector-title');
  const stadiumSvg = document.getElementById('cairo-stadium-svg');
  const bookTicketCta = document.getElementById('book-ticket-cta');
  const paymentModal = document.getElementById('payment-modal');

  // 1. Anti-Scalping Countdown Timer
  const timerInterval = setInterval(() => {
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      if (countdownDisplay) countdownDisplay.textContent = "00:00";
      if (countdownBar) countdownBar.style.width = "0%";
      showToast("انتهت مهلة حجز المقاعد المؤقتة. يُرجى إعادة اختيار المقعد من الخريطة.", "warning");
      setTimeout(() => window.location.reload(), 2000);
      return;
    }
    remainingSeconds--;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    if (countdownDisplay) {
      countdownDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    if (countdownBar) {
      const pct = (remainingSeconds / totalSessionSeconds) * 100;
      countdownBar.style.width = `${Math.max(0, pct)}%`;
      if (remainingSeconds < 180) {
        countdownBar.classList.remove('bg-secondary');
        countdownBar.classList.add('bg-error');
        countdownDisplay.classList.remove('text-secondary');
        countdownDisplay.classList.add('text-error');
      }
    }
  }, 1000);

  // 2. Price Calculation Updater
  function updatePricing() {
    const baseSubtotal = currentTicketPrice * quantity;
    const total = baseSubtotal + serviceFee;
    
    if (qtyCount) qtyCount.textContent = quantity;
    if (calcQty) calcQty.textContent = quantity === 1 ? '١' : '٢';
    if (calcBasePrice) calcBasePrice.textContent = `${baseSubtotal} ج.م`;
    if (calcTotalPrice) calcTotalPrice.textContent = `${total} ج.م`;
    if (ctaButtonText) ctaButtonText.textContent = `تأكيد الحجز والانتقال للدفع (${total} ج.م)`;

    if (quantity === 2) {
      if (secondaryFanWrapper) {
        secondaryFanWrapper.classList.remove('hidden');
        secondaryFanWrapper.classList.add('flex');
      }
    } else {
      if (secondaryFanWrapper) {
        secondaryFanWrapper.classList.add('hidden');
        secondaryFanWrapper.classList.remove('flex');
      }
    }
  }

  // 3. Quantity Controls (Max 2 rule)
  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      if (quantity < 2) {
        quantity++;
        qtyMinus.disabled = false;
        qtyPlus.disabled = true;
        updatePricing();
        showToast('تمت إضافة تذكرة ثانية. يُرجى التحقق من Fan ID للمرافق', 'info');
      }
    });
  }

  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        qtyPlus.disabled = false;
        qtyMinus.disabled = true;
        updatePricing();
      }
    });
  }

  // 4. Secondary Fan ID Verification Mock
  if (verifySecondaryBtn) {
    verifySecondaryBtn.addEventListener('click', () => {
      const input = document.getElementById('secondary-fan-input');
      if (!input || !input.value.trim()) {
        showToast('يرجى إدخال رقم مشجع صحيح للمرافق', 'warning');
        return;
      }
      secondaryStatusMsg.classList.remove('hidden');
      secondaryStatusMsg.textContent = 'جاري التحقق من بطاقة تذكرتي...';
      setTimeout(() => {
        secondaryStatusMsg.textContent = '✓ تم التحقق بنجاح من بيانات المرافق: محمود تامر عبد العال';
        secondaryStatusMsg.classList.remove('text-secondary');
        secondaryStatusMsg.classList.add('text-primary');
        verifySecondaryBtn.disabled = true;
        verifySecondaryBtn.textContent = 'معتمد';
        verifySecondaryBtn.classList.add('bg-primary-container', 'text-on-primary-container');
        showToast('تم اعتماد بطاقة المرافق الثاني بنجاح', 'success');
      }, 700);
    });
  }

  // 5. Interactive SVG Sectors Click
  const sectorElements = document.querySelectorAll('.sector-path');
  sectorElements.forEach(elem => {
    elem.addEventListener('click', () => {
      const sectorKey = elem.getAttribute('data-sector');
      if (sectorKey === 'second') {
        showToast('هذا المدرج مباع بالكامل، يرجى اختيار مدرج بديل متاح.', 'warning');
        return;
      }

      const name = elem.getAttribute('data-name');
      const price = parseInt(elem.getAttribute('data-price') || '75', 10);
      const gate = elem.getAttribute('data-gate');

      currentTicketPrice = price;
      selectedSectorName = name;
      selectedGate = gate;

      if (summarySector) summarySector.textContent = name;
      if (summaryGate) summaryGate.textContent = gate;
      if (matrixSectorTitle) matrixSectorTitle.textContent = `${name} (بلوك 14)`;
      if (summarySeat) summarySeat.textContent = `${selectedBlock} • مقعد ${selectedSeatNum} (${selectedRow})`;

      // Highlight active clicked path
      sectorElements.forEach(s => {
        if (s.getAttribute('data-sector') !== 'second') {
          s.classList.remove('stroke-[#4edea3]', 'stroke-[3.5]', 'drop-shadow-[0_0_12px_rgba(78,222,163,0.5)]');
        }
      });
      elem.classList.add('stroke-[#4edea3]', 'stroke-[3.5]');

      updatePricing();
      showToast(`تم اختيار مدرج: ${name}`, 'info');
    });
  });

  // 6. Interactive Seat Matrix Individual Buttons
  const seatButtons = document.querySelectorAll('.seat-btn:not([disabled])');
  seatButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      seatButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary', 'shadow-[0_0_12px_rgba(78,222,163,0.8)]', 'scale-110');
        b.classList.add('bg-primary-container', 'text-on-primary-container');
      });

      btn.classList.remove('bg-primary-container', 'text-on-primary-container');
      btn.classList.add('bg-primary', 'text-on-primary', 'shadow-[0_0_12px_rgba(78,222,163,0.8)]', 'scale-110');
      
      selectedSeatNum = btn.getAttribute('data-seat');
      if (summarySeat) {
        summarySeat.textContent = `${selectedBlock} • مقعد ${selectedSeatNum} (${selectedRow})`;
      }
      showToast(`تم تحديد المقعد رقم ${selectedSeatNum}`, 'success');
    });
  });

  // 7. Zoom Map Controls
  let currentScale = 1;
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const resetViewBtn = document.getElementById('reset-view-btn');

  if (zoomInBtn && stadiumSvg) {
    zoomInBtn.addEventListener('click', () => {
      if (currentScale < 1.3) {
        currentScale += 0.1;
        stadiumSvg.style.transform = `scale(${currentScale})`;
      }
    });
  }

  if (zoomOutBtn && stadiumSvg) {
    zoomOutBtn.addEventListener('click', () => {
      if (currentScale > 0.85) {
        currentScale -= 0.1;
        stadiumSvg.style.transform = `scale(${currentScale})`;
      }
    });
  }

  if (resetViewBtn && stadiumSvg) {
    resetViewBtn.addEventListener('click', () => {
      currentScale = 1;
      stadiumSvg.style.transform = 'scale(1)';
    });
  }

  // 8. Checkout & Flow to Tickets Page
  if (bookTicketCta) {
    bookTicketCta.addEventListener('click', () => {
      if (quantity === 2 && verifySecondaryBtn && !verifySecondaryBtn.disabled) {
        showToast('يُرجى إدخال والتحقق من بطاقة المشجع (Fan ID) للمرافق الثاني للمتابعة.', 'warning');
        return;
      }

      // Prepare booking data payload
      const randomRef = `#EPL-2025-${Math.floor(10000 + Math.random() * 90000)}`;
      const bookingData = {
        reference: randomRef,
        matchTitle: matchName,
        matchRound: 'دوري نايل 2024/2025 • الجولة 15',
        stadium: 'استاد القاهرة الدولي',
        date: 'الجمعة 28 مارس 2025',
        time: '08:00 مساءً',
        gate: selectedGate,
        sector: selectedSectorName,
        block: selectedBlock,
        row: selectedRow,
        seat: selectedSeatNum,
        fanName: 'أحمد مصطفى إبراهيم',
        fanId: 'EG-92841-AH',
        nationalId: '2980415******',
        club: selectedSectorName.includes('الزمالك') ? 'الزمالك' : 'الأهلي',
        price: (currentTicketPrice * quantity) + serviceFee,
        quantity: quantity,
        bookedAt: new Date().toISOString()
      };

      // Save to storage
      saveActiveBooking(bookingData);

      // Show payment modal/overlay if exists
      if (paymentModal) {
        paymentModal.classList.remove('hidden');
        paymentModal.classList.add('flex');
        
        setTimeout(() => {
          window.location.href = 'tickets.html';
        }, 1600);
      } else {
        showToast('تم تأكيد الحجز بنجاح! جاري الانتقال إلى تذكرتك الرقمية...', 'success');
        setTimeout(() => {
          window.location.href = 'tickets.html';
        }, 800);
      }
    });
  }
});
