/**
 * EPL Matchday Gate - Shared Application Scripts
 * تذكرتي دوري نايل - المنظومة الموحدة لحجز تذاكر الدوري المصري الممتاز
 */

// 1. Toast Notification Utility
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconName = type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'info';
  const iconColor = type === 'success' ? 'text-primary' : type === 'warning' ? 'text-secondary' : 'text-tertiary';

  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor}">${iconName}</span>
    <span class="font-body-sm">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

// 2. Local Storage Helpers for Booking Persistence
const EPL_STORAGE_KEY = 'epl_active_ticket';

function saveActiveBooking(bookingData) {
  try {
    localStorage.setItem(EPL_STORAGE_KEY, JSON.stringify(bookingData));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

function getActiveBooking() {
  try {
    const data = localStorage.getItem(EPL_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Storage read failed:', e);
  }
  // Default matchpass data
  return {
    reference: '#EPL-2025-88492',
    matchTitle: 'الأهلي vs الزمالك',
    matchRound: 'قمة دوري نايل • الجولة 15',
    stadium: 'استاد القاهرة الدولي',
    date: 'الجمعة 28 مارس 2025',
    time: '08:00 مساءً',
    gate: 'بوابة 5 (شارع صلاح سالم)',
    sector: 'الدرجة الثالثة شمال (جماهير الأهلي)',
    block: 'بلوك 14',
    row: 'صف 8',
    seat: '42',
    fanName: 'أحمد مصطفى إبراهيم',
    fanId: 'EG-92841-AH',
    nationalId: '2980415******',
    club: 'الأهلي',
    price: 85,
    quantity: 1,
    bookedAt: new Date().toISOString()
  };
}

// 3. Page Initialization & Global Controls
document.addEventListener('DOMContentLoaded', () => {
  // A. Mobile Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('closed');
      if (drawerBackdrop) drawerBackdrop.classList.remove('hidden');
    });
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('closed');
    if (drawerBackdrop) drawerBackdrop.classList.add('hidden');
  }

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  // B. Notifications Dropdown Toggle
  const notifBtn = document.getElementById('notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
        notifDropdown.classList.add('hidden');
      }
    });
  }

  // C. Header Fan ID Quick Search
  const headerSearchInput = document.getElementById('header-search-input');
  if (headerSearchInput) {
    headerSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = headerSearchInput.value.trim();
        if (query) {
          window.location.href = `fan-id.html?search=${encodeURIComponent(query)}`;
        } else {
          showToast('برجاء كتابة رقم المشجع أو الرقم القومي للاستعلام', 'warning');
        }
      }
    });
  }

  // D. Language Switcher
  const langBtns = document.querySelectorAll('.lang-toggle-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('النسخة الإنجليزية قيد التجهيز وسيتم إطلاقها قريباً!', 'info');
    });
  });

  // E. Set Active Navbar link according to current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('header nav a, #mobile-drawer a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const isCurrent = (currentPath === 'index.html' && (href === 'index.html' || href === './')) ||
                      (currentPath !== '' && href.includes(currentPath));

    if (isCurrent && !link.classList.contains('no-active-style')) {
      link.setAttribute('aria-current', 'page');
      link.classList.remove('text-on-surface-variant', 'hover:text-on-surface', 'hover:bg-surface-container');
      link.classList.add('bg-surface-container-high', 'text-primary', 'font-label-md', 'rounded-lg');
    }
  });
});
