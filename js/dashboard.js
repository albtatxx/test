/**
 * EPL Matchday Gate - Customer Orders Dashboard Script
 * تذكرتي دوري نايل - لوحة تحكم وإدارة تفاصيل طلبات وحجوزات العملاء
 */

// Initial seed orders for demonstration if storage/firebase is new
const SEED_ORDERS = [
  {
    id: "epl-order-1",
    reference: "#EPL-2025-88492",
    fanName: "أحمد مصطفى إبراهيم",
    fanId: "EG-92841-AH",
    nationalId: "29804151203948",
    phone: "01002938471",
    matchTitle: "الأهلي vs الزمالك",
    matchRound: "قمة دوري نايل • الجولة 15",
    stadium: "استاد القاهرة الدولي",
    date: "الجمعة 28 مارس 2025",
    time: "08:00 مساءً",
    gate: "بوابة 5 (شارع صلاح سالم)",
    sector: "الدرجة الثالثة شمال (جماهير الأهلي)",
    block: "بلوك 14",
    row: "صف 8",
    seat: "42",
    club: "الأهلي",
    paymentMethod: "فودافون كاش",
    price: 85,
    quantity: 1,
    status: "confirmed", // confirmed, pending, admitted, cancelled
    source: "Firebase Cloud",
    bookedAt: new Date(Date.now() - 35 * 60000).toISOString()
  },
  {
    id: "epl-order-2",
    reference: "#EPL-2025-74912",
    fanName: "محمود حسن تامر",
    fanId: "EG-61029-ZM",
    nationalId: "29509180102941",
    phone: "01124859302",
    matchTitle: "الأهلي vs الزمالك",
    matchRound: "قمة دوري نايل • الجولة 15",
    stadium: "استاد القاهرة الدولي",
    date: "الجمعة 28 مارس 2025",
    time: "08:00 مساءً",
    gate: "بوابة 7 (طريق النصر)",
    sector: "الدرجة الثالثة يمين (جماهير الزمالك)",
    block: "بلوك 18",
    row: "صف 4",
    seat: "19",
    club: "الزمالك",
    paymentMethod: "فوري Fawry",
    price: 85,
    quantity: 1,
    status: "confirmed",
    source: "Firebase Cloud",
    bookedAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: "epl-order-3",
    reference: "#EPL-2025-91204",
    fanName: "طارق سليم عبد الله",
    fanId: "EG-44018-AH",
    nationalId: "29011041802934",
    phone: "01284930219",
    matchTitle: "الأهلي vs الزمالك",
    matchRound: "قمة دوري نايل • الجولة 15",
    stadium: "استاد القاهرة الدولي",
    date: "الجمعة 28 مارس 2025",
    time: "08:00 مساءً",
    gate: "بوابة 1 (شارع الفنجري)",
    sector: "المقصورة الرئيسية والـ VIP",
    block: "بلوك VIP-A",
    row: "صف 2",
    seat: "12",
    club: "الأهلي",
    paymentMethod: "بطاقة ميزة البنكية",
    price: 1010,
    quantity: 1,
    status: "admitted",
    source: "Firebase Cloud",
    bookedAt: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: "epl-order-4",
    reference: "#EPL-2025-63189",
    fanName: "كريم حسام الدين",
    fanId: "EG-77391-PY",
    nationalId: "29906230103982",
    phone: "01094820194",
    matchTitle: "بيراميدز vs الإسماعيلي",
    matchRound: "دوري نايل • الجولة 15",
    stadium: "استاد 30 يونيو (الدفاع الجوي)",
    date: "السبت 15 مارس 2025",
    time: "05:00 مساءً",
    gate: "بوابة 2 (محور المشير)",
    sector: "الدرجة الأولى علوي",
    block: "بلوك 3",
    row: "صف 5",
    seat: "27",
    club: "بيراميدز",
    paymentMethod: "إنستاباي InstaPay",
    price: 260,
    quantity: 1,
    status: "pending",
    source: "Firebase Cloud",
    bookedAt: new Date(Date.now() - 8 * 3600000).toISOString()
  },
  {
    id: "epl-order-5",
    reference: "#EPL-2025-50211",
    fanName: "إسلام يحيى النجار",
    fanId: "EG-31849-MS",
    nationalId: "29703111402941",
    phone: "01584930215",
    matchTitle: "المصري vs سموحة",
    matchRound: "دوري نايل • الجولة 15",
    stadium: "استاد برج العرب بالإسكندرية",
    date: "السبت 15 مارس 2025",
    time: "08:00 مساءً",
    gate: "بوابة 4 (طريق الكافوري)",
    sector: "الدرجة الثالثة بحري",
    block: "بلوك 9",
    row: "صف 6",
    seat: "33",
    club: "المصري",
    paymentMethod: "فوري Fawry",
    price: 85,
    quantity: 1,
    status: "confirmed",
    source: "Firebase Cloud",
    bookedAt: new Date(Date.now() - 14 * 3600000).toISOString()
  },
  {
    id: "epl-order-6",
    reference: "#EPL-2025-41982",
    fanName: "عمر فاروق الشناوي",
    fanId: "EG-59201-IT",
    nationalId: "29612010104829",
    phone: "01029384019",
    matchTitle: "الاتحاد السكندري vs زد إف سي",
    matchRound: "دوري نايل • الجولة 15",
    stadium: "استاد الإسكندرية الرياضي",
    date: "الأحد 16 مارس 2025",
    time: "07:00 مساءً",
    gate: "بوابة 3 (شارع محرم بك)",
    sector: "الدرجة الثانية الموحدة",
    block: "بلوك 5",
    row: "صف 10",
    seat: "55",
    club: "الاتحاد السكندري",
    paymentMethod: "فودافون كاش",
    price: 85,
    quantity: 1,
    status: "cancelled",
    source: "Firebase Cloud",
    bookedAt: new Date(Date.now() - 24 * 3600000).toISOString()
  }
];

class OrdersDashboard {
  constructor() {
    this.allOrders = [];
    this.filteredOrders = [];
    this.currentOrder = null;
    this.searchQuery = "";
    this.statusFilter = "all";
    this.matchFilter = "all";
    this.paymentFilter = "all";
    this.sortBy = "date-desc";

    this.init();
  }

  async init() {
    this.bindDomElements();
    this.bindEvents();
    await this.loadOrders();
    this.renderStats();
    this.applyFilters();
  }

  bindDomElements() {
    this.ordersTableBody = document.getElementById("ordersTableBody");
    this.ordersCardsMobile = document.getElementById("ordersCardsMobile");
    this.emptyState = document.getElementById("emptyState");
    this.orderCountBadge = document.getElementById("orderCountBadge");

    // Stats Elements
    this.statTotalOrders = document.getElementById("statTotalOrders");
    this.statTotalRevenue = document.getElementById("statTotalRevenue");
    this.statConfirmedOrders = document.getElementById("statConfirmedOrders");
    this.statActiveFans = document.getElementById("statActiveFans");
    this.firebaseStatusBadge = document.getElementById("firebaseStatusBadge");

    // Filter Controls
    this.searchInput = document.getElementById("searchOrderInput");
    this.statusFilterSelect = document.getElementById("statusFilterSelect");
    this.matchFilterSelect = document.getElementById("matchFilterSelect");
    this.paymentFilterSelect = document.getElementById("paymentFilterSelect");
    this.sortSelect = document.getElementById("sortSelect");

    // Action Buttons
    this.refreshBtn = document.getElementById("refreshOrdersBtn");
    this.exportBtn = document.getElementById("exportOrdersBtn");
    this.addTestOrderBtn = document.getElementById("addTestOrderBtn");

    // Modal Elements
    this.orderModal = document.getElementById("orderDetailModal");
    this.closeModalBtn = document.getElementById("closeOrderModalBtn");
    this.modalBackdrop = document.getElementById("modalBackdrop");
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.applyFilters();
      });
    }

    if (this.statusFilterSelect) {
      this.statusFilterSelect.addEventListener("change", (e) => {
        this.statusFilter = e.target.value;
        this.applyFilters();
      });
    }

    if (this.matchFilterSelect) {
      this.matchFilterSelect.addEventListener("change", (e) => {
        this.matchFilter = e.target.value;
        this.applyFilters();
      });
    }

    if (this.paymentFilterSelect) {
      this.paymentFilterSelect.addEventListener("change", (e) => {
        this.paymentFilter = e.target.value;
        this.applyFilters();
      });
    }

    if (this.sortSelect) {
      this.sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    if (this.refreshBtn) {
      this.refreshBtn.addEventListener("click", async () => {
        this.refreshBtn.classList.add("animate-spin");
        await this.loadOrders();
        this.renderStats();
        this.applyFilters();
        setTimeout(() => {
          this.refreshBtn.classList.remove("animate-spin");
          if (typeof showToast === "function") {
            showToast("تم تحديث ومزامنة بيانات الطلبات بنجاح من Firebase", "success");
          }
        }, 600);
      });
    }

    if (this.exportBtn) {
      this.exportBtn.addEventListener("click", () => this.exportToCSV());
    }

    if (this.addTestOrderBtn) {
      this.addTestOrderBtn.addEventListener("click", () => this.createMockOrder());
    }

    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener("click", () => this.closeModal());
    }

    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener("click", () => this.closeModal());
    }

    // Escape key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.orderModal && !this.orderModal.classList.contains("hidden")) {
        this.closeModal();
      }
    });
  }

  async loadOrders() {
    let combined = [];

    // 1. Fetch from Firebase Firestore if available
    if (window.EPL_FIREBASE && window.EPL_FIREBASE.getAllTicketsFromFirestore) {
      try {
        const cloudTickets = await window.EPL_FIREBASE.getAllTicketsFromFirestore();
        if (cloudTickets && cloudTickets.length > 0) {
          combined.push(...cloudTickets.map(item => ({
            ...item,
            source: "Firebase Cloud",
            status: item.status || "confirmed"
          })));
          if (this.firebaseStatusBadge) {
            this.firebaseStatusBadge.innerHTML = `
              <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span class="text-primary font-bold">Firebase متصل سحابياً</span>
            `;
          }
        }
      } catch (err) {
        console.warn("Could not retrieve cloud tickets:", err);
      }
    }

    // 2. Fetch from Local Storage active booking
    try {
      const localActive = localStorage.getItem("epl_active_ticket");
      if (localActive) {
        const activeData = JSON.parse(localActive);
        // Avoid duplicate if same reference already added from cloud
        if (!combined.some(o => o.reference === activeData.reference)) {
          combined.push({
            id: "local-" + (activeData.reference || Date.now()),
            status: "confirmed",
            paymentMethod: "فودافون كاش",
            source: "Local Storage",
            ...activeData
          });
        }
      }

      // Check stored custom list
      const savedOrdersList = localStorage.getItem("epl_all_dashboard_orders");
      if (savedOrdersList) {
        const customList = JSON.parse(savedOrdersList);
        customList.forEach(item => {
          if (!combined.some(o => o.reference === item.reference)) {
            combined.push(item);
          }
        });
      }
    } catch (e) {
      console.warn("Local storage read note:", e);
    }

    // 3. Fallback to SEED_ORDERS if list is sparse
    SEED_ORDERS.forEach(seed => {
      if (!combined.some(o => o.reference === seed.reference)) {
        combined.push(seed);
      }
    });

    this.allOrders = combined;
  }

  saveOrdersToLocal() {
    try {
      localStorage.setItem("epl_all_dashboard_orders", JSON.stringify(this.allOrders));
    } catch (e) {
      console.warn("Save dashboard orders note:", e);
    }
  }

  renderStats() {
    const totalOrders = this.allOrders.length;
    const totalRevenue = this.allOrders.reduce((sum, o) => {
      if (o.status !== "cancelled") {
        return sum + (Number(o.price) || 85);
      }
      return sum;
    }, 0);

    const confirmedCount = this.allOrders.filter(o => o.status === "confirmed" || o.status === "admitted").length;
    const uniqueFans = new Set(this.allOrders.map(o => o.fanId || o.fanName)).size;

    if (this.statTotalOrders) this.statTotalOrders.textContent = totalOrders.toLocaleString("ar-EG");
    if (this.statTotalRevenue) this.statTotalRevenue.textContent = `${totalRevenue.toLocaleString("ar-EG")} ج.م`;
    if (this.statConfirmedOrders) this.statConfirmedOrders.textContent = confirmedCount.toLocaleString("ar-EG");
    if (this.statActiveFans) this.statActiveFans.textContent = uniqueFans.toLocaleString("ar-EG");
    if (this.orderCountBadge) this.orderCountBadge.textContent = `${totalOrders} طلب مسجل`;
  }

  applyFilters() {
    let result = [...this.allOrders];

    // Search query filter (reference, name, fanId, nationalId, phone)
    if (this.searchQuery) {
      result = result.filter(o => {
        const ref = (o.reference || "").toLowerCase();
        const name = (o.fanName || "").toLowerCase();
        const fid = (o.fanId || "").toLowerCase();
        const nid = (o.nationalId || "").toLowerCase();
        const phone = (o.phone || "").toLowerCase();
        const match = (o.matchTitle || "").toLowerCase();
        return ref.includes(this.searchQuery) ||
               name.includes(this.searchQuery) ||
               fid.includes(this.searchQuery) ||
               nid.includes(this.searchQuery) ||
               phone.includes(this.searchQuery) ||
               match.includes(this.searchQuery);
      });
    }

    // Status filter
    if (this.statusFilter !== "all") {
      result = result.filter(o => o.status === this.statusFilter);
    }

    // Match filter
    if (this.matchFilter !== "all") {
      result = result.filter(o => (o.matchTitle || "").includes(this.matchFilter));
    }

    // Payment method filter
    if (this.paymentFilter !== "all") {
      result = result.filter(o => (o.paymentMethod || "").includes(this.paymentFilter));
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.bookedAt || 0).getTime();
      const dateB = new Date(b.bookedAt || 0).getTime();
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;

      if (this.sortBy === "date-desc") return dateB - dateA;
      if (this.sortBy === "date-asc") return dateA - dateB;
      if (this.sortBy === "price-desc") return priceB - priceA;
      if (this.sortBy === "price-asc") return priceA - priceB;
      return 0;
    });

    this.filteredOrders = result;
    this.renderOrdersTable();
  }

  getStatusBadge(status) {
    switch (status) {
      case "confirmed":
        return `
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/30">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            مؤكد ومعتمد
          </span>`;
      case "admitted":
        return `
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-secondary/15 text-secondary border border-secondary/30">
            <span class="material-symbols-outlined text-xs">turnstile</span>
            تم العبور بالبوابة
          </span>`;
      case "pending":
        return `
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-tertiary/15 text-tertiary border border-tertiary/30">
            <span class="material-symbols-outlined text-xs">schedule</span>
            قيد الدفع
          </span>`;
      case "cancelled":
        return `
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-error/15 text-error border border-error/30">
            <span class="material-symbols-outlined text-xs">cancel</span>
            ملغي / مسترد
          </span>`;
      default:
        return `<span class="px-2 py-0.5 rounded-full text-xs bg-surface-container text-on-surface-variant">${status || 'غير محدد'}</span>`;
    }
  }

  renderOrdersTable() {
    if (!this.ordersTableBody) return;

    if (this.filteredOrders.length === 0) {
      this.ordersTableBody.innerHTML = "";
      if (this.ordersCardsMobile) this.ordersCardsMobile.innerHTML = "";
      if (this.emptyState) this.emptyState.classList.remove("hidden");
      return;
    }

    if (this.emptyState) this.emptyState.classList.add("hidden");

    // Render Desktop Table
    this.ordersTableBody.innerHTML = this.filteredOrders.map(order => {
      const formattedDate = new Date(order.bookedAt || Date.now()).toLocaleDateString("ar-EG", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      return `
        <tr class="border-b border-white/5 hover:bg-surface-container/60 transition-colors group">
          <!-- Reference & Date -->
          <td class="py-4 px-4 align-middle">
            <div class="flex flex-col">
              <span class="font-mono font-bold text-xs text-primary group-hover:underline cursor-pointer" onclick="dashboard.openModal('${order.reference}')">
                ${order.reference}
              </span>
              <span class="text-[11px] text-outline">${formattedDate}</span>
            </div>
          </td>

          <!-- Customer / Fan Details -->
          <td class="py-4 px-4 align-middle">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center font-bold text-xs text-primary border border-white/5 shrink-0">
                ${(order.fanName || "مشجع").slice(0, 2)}
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-xs text-on-surface">${order.fanName || "أحمد مصطفى"}</span>
                <span class="font-mono text-[11px] text-secondary">${order.fanId || "EG-00000"}</span>
              </div>
            </div>
          </td>

          <!-- Match & Stadium -->
          <td class="py-4 px-4 align-middle">
            <div class="flex flex-col">
              <span class="font-bold text-xs text-on-surface">${order.matchTitle || "الأهلي vs الزمالك"}</span>
              <span class="text-[11px] text-on-surface-variant flex items-center gap-1">
                <span class="material-symbols-outlined text-xs text-outline">stadium</span>
                ${order.stadium || "استاد القاهرة الدولي"}
              </span>
            </div>
          </td>

          <!-- Seat & Stand -->
          <td class="py-4 px-4 align-middle">
            <div class="flex flex-col">
              <span class="text-xs text-on-surface font-semibold">${order.sector ? order.sector.split('(')[0].trim() : 'درجة ثالثة'}</span>
              <span class="text-[11px] text-primary font-mono font-bold">${order.block || 'بلوك 14'} • مقعد ${order.seat || '42'}</span>
            </div>
          </td>

          <!-- Payment & Price -->
          <td class="py-4 px-4 align-middle">
            <div class="flex flex-col">
              <span class="font-headline font-bold text-sm text-on-surface">${order.price || 85} ج.م</span>
              <span class="text-[10px] text-outline flex items-center gap-1">
                <span class="material-symbols-outlined text-[12px] text-tertiary">payment</span>
                ${order.paymentMethod || 'فودافون كاش'}
              </span>
            </div>
          </td>

          <!-- Status Badge -->
          <td class="py-4 px-4 align-middle">
            ${this.getStatusBadge(order.status)}
          </td>

          <!-- Actions -->
          <td class="py-4 px-4 align-middle text-left">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="dashboard.openModal('${order.reference}')" class="p-2 rounded-xl bg-surface-container hover:bg-surface-container-highest text-primary transition-colors border border-white/5" title="عرض تفاصيل الطلب">
                <span class="material-symbols-outlined text-base">visibility</span>
              </button>
              <button onclick="dashboard.printTicket('${order.reference}')" class="p-2 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface transition-colors border border-white/5" title="طباعة التذكرة">
                <span class="material-symbols-outlined text-base">print</span>
              </button>
              <button onclick="dashboard.toggleStatus('${order.reference}')" class="p-2 rounded-xl bg-surface-container hover:bg-surface-container-highest text-secondary transition-colors border border-white/5" title="تحديث الحالة">
                <span class="material-symbols-outlined text-base">swap_horiz</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Render Mobile Cards View
    if (this.ordersCardsMobile) {
      this.ordersCardsMobile.innerHTML = this.filteredOrders.map(order => {
        return `
          <div class="bg-surface-container-low p-4 rounded-2xl border border-white/5 flex flex-col gap-3 shadow-md">
            <div class="flex items-center justify-between pb-2 border-b border-white/5">
              <span class="font-mono font-bold text-xs text-primary">${order.reference}</span>
              ${this.getStatusBadge(order.status)}
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center font-bold text-xs">
                  ${(order.fanName || "مشجع").slice(0, 2)}
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-xs text-on-surface">${order.fanName}</span>
                  <span class="font-mono text-[10px] text-secondary">${order.fanId}</span>
                </div>
              </div>
              <span class="font-headline font-bold text-sm text-primary">${order.price} ج.م</span>
            </div>

            <div class="bg-surface-container p-2.5 rounded-xl flex items-center justify-between text-xs text-on-surface-variant">
              <span>${order.matchTitle}</span>
              <span class="font-mono font-bold text-on-surface">${order.block} • مقعد ${order.seat}</span>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
              <button onclick="dashboard.openModal('${order.reference}')" class="flex-1 py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-highest text-primary font-bold text-xs flex items-center justify-center gap-1 border border-white/5">
                <span class="material-symbols-outlined text-sm">visibility</span>
                <span>تفاصيل الطلب</span>
              </button>
              <button onclick="dashboard.toggleStatus('${order.reference}')" class="p-2 rounded-xl bg-surface-container text-secondary border border-white/5" title="تحديث الحالة">
                <span class="material-symbols-outlined text-base">swap_horiz</span>
              </button>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  openModal(reference) {
    const order = this.allOrders.find(o => o.reference === reference);
    if (!order) return;

    this.currentOrder = order;

    // Populate modal fields
    document.getElementById("modalOrderRef").textContent = order.reference;
    document.getElementById("modalOrderStatus").innerHTML = this.getStatusBadge(order.status);
    document.getElementById("modalFanName").textContent = order.fanName || "غير محدد";
    document.getElementById("modalFanId").textContent = order.fanId || "غير محدد";
    document.getElementById("modalNationalId").textContent = order.nationalId || "2980415******";
    document.getElementById("modalPhone").textContent = order.phone || "+20 100 293 8471";
    document.getElementById("modalClub").textContent = order.club || "الأهلي";

    document.getElementById("modalMatchTitle").textContent = order.matchTitle || "الأهلي vs الزمالك";
    document.getElementById("modalMatchRound").textContent = order.matchRound || "قمة دوري نايل";
    document.getElementById("modalStadium").textContent = order.stadium || "استاد القاهرة الدولي";
    document.getElementById("modalMatchTime").textContent = `${order.date} • ${order.time}`;
    document.getElementById("modalGate").textContent = order.gate || "بوابة 5 (صلاح سالم)";

    document.getElementById("modalSector").textContent = order.sector || "الدرجة الثالثة شمال";
    document.getElementById("modalBlock").textContent = order.block || "بلوك 14";
    document.getElementById("modalRow").textContent = order.row || "صف 8";
    document.getElementById("modalSeat").textContent = order.seat || "42";

    const basePrice = (order.price ? order.price - 10 : 75);
    document.getElementById("modalBasePrice").textContent = `${basePrice} ج.م`;
    document.getElementById("modalTotalPrice").textContent = `${order.price || 85} ج.م`;
    document.getElementById("modalPaymentMethod").textContent = order.paymentMethod || "فودافون كاش";
    document.getElementById("modalBookedAt").textContent = new Date(order.bookedAt || Date.now()).toLocaleString("ar-EG");
    document.getElementById("modalSource").textContent = order.source || "Firebase Firestore Cloud";

    if (this.orderModal) {
      this.orderModal.classList.remove("hidden");
      this.orderModal.classList.add("flex");
    }
  }

  closeModal() {
    if (this.orderModal) {
      this.orderModal.classList.add("hidden");
      this.orderModal.classList.remove("flex");
    }
    this.currentOrder = null;
  }

  toggleStatus(reference) {
    const order = this.allOrders.find(o => o.reference === reference);
    if (!order) return;

    const nextStatus = {
      "confirmed": "admitted",
      "admitted": "cancelled",
      "cancelled": "pending",
      "pending": "confirmed"
    };

    const oldStatus = order.status;
    order.status = nextStatus[oldStatus] || "confirmed";

    // Update in Firestore if connected
    if (window.EPL_FIREBASE && window.EPL_FIREBASE.updateTicketStatus && order.id) {
      window.EPL_FIREBASE.updateTicketStatus(order.id, order.status);
    }

    this.saveOrdersToLocal();
    this.renderStats();
    this.applyFilters();

    if (this.currentOrder && this.currentOrder.reference === reference) {
      this.openModal(reference);
    }

    if (typeof showToast === "function") {
      showToast(`تم تحديث حالة الطلب ${reference} بنجاح`, "info");
    }
  }

  printTicket(reference) {
    const order = this.allOrders.find(o => o.reference === reference);
    if (!order) return;

    // Save as active ticket then redirect to tickets page or trigger print
    localStorage.setItem("epl_active_ticket", JSON.stringify(order));
    window.open("tickets.html", "_blank");
  }

  exportToCSV() {
    if (this.filteredOrders.length === 0) {
      if (typeof showToast === "function") showToast("لا توجد بيانات لتصديرها", "warning");
      return;
    }

    const headers = ["رقم الحجز", "اسم المشجع", "بطاقة Fan ID", "الرقم القومي", "الهاتف", "المباراة", "الاستاد", "المدرج", "المقعد", "السعر", "طريقة الدفع", "الحالة", "تاريخ الحجز"];
    const rows = this.filteredOrders.map(o => [
      o.reference,
      `"${o.fanName || ''}"`,
      o.fanId || '',
      `"${o.nationalId || ''}"`,
      `"${o.phone || ''}"`,
      `"${o.matchTitle || ''}"`,
      `"${o.stadium || ''}"`,
      `"${o.sector || ''}"`,
      `"${o.block} - ${o.seat}"`,
      o.price || 85,
      `"${o.paymentMethod || ''}"`,
      o.status || '',
      `"${o.bookedAt || ''}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `EPL_Tickets_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (typeof showToast === "function") {
      showToast("تم تصدير ملف تقرير الطلبات بتنسيق CSV بنجاح", "success");
    }
  }

  createMockOrder() {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const matches = [
      { title: "الأهلي vs الزمالك", std: "استاد القاهرة الدولي" },
      { title: "بيراميدز vs الإسماعيلي", std: "استاد الدفاع الجوي" },
      { title: "المصري vs سموحة", std: "استاد برج العرب" },
      { title: "الاتحاد السكندري vs زد إف سي", std: "استاد الإسكندرية" }
    ];
    const pickedMatch = matches[Math.floor(Math.random() * matches.length)];
    const names = ["حازم إمام الدسوقي", "محمد عبد الشافي", "عمرو السولية", "مصطفى فتحي", "أحمد الشناوي", "محمد شريف"];
    const pickedName = names[Math.floor(Math.random() * names.length)];
    const payments = ["فوري Fawry", "فودافون كاش", "إنستاباي InstaPay", "بطاقات ميزة"];
    const pickedPayment = payments[Math.floor(Math.random() * payments.length)];

    const newOrder = {
      id: "mock-" + Date.now(),
      reference: `#EPL-2025-${randomNum}`,
      fanName: pickedName,
      fanId: `EG-${Math.floor(10000 + Math.random() * 90000)}-FAN`,
      nationalId: `2980${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      phone: `010${Math.floor(10000000 + Math.random() * 90000000)}`,
      matchTitle: pickedMatch.title,
      matchRound: "دوري نايل • الجولة 15",
      stadium: pickedMatch.std,
      date: "الجمعة 28 مارس 2025",
      time: "08:00 مساءً",
      gate: `بوابة ${Math.floor(Math.random() * 6) + 1}`,
      sector: "الدرجة الثالثة شمال",
      block: `بلوك ${Math.floor(Math.random() * 20) + 1}`,
      row: `صف ${Math.floor(Math.random() * 12) + 1}`,
      seat: `${Math.floor(Math.random() * 50) + 1}`,
      club: pickedMatch.title.split('vs')[0].trim(),
      paymentMethod: pickedPayment,
      price: [75, 85, 100, 250][Math.floor(Math.random() * 4)],
      quantity: 1,
      status: "confirmed",
      source: "Local & Firebase Synced",
      bookedAt: new Date().toISOString()
    };

    this.allOrders.unshift(newOrder);

    // Save to Firestore too if available
    if (window.EPL_FIREBASE && window.EPL_FIREBASE.saveTicketToFirestore) {
      window.EPL_FIREBASE.saveTicketToFirestore(newOrder);
    }

    this.saveOrdersToLocal();
    this.renderStats();
    this.applyFilters();

    if (typeof showToast === "function") {
      showToast(`تمت إضافة طلب تجريبي جديد برقم ${newOrder.reference}`, "success");
    }
  }
}

// Global instance
let dashboard = null;

document.addEventListener("DOMContentLoaded", () => {
  dashboard = new OrdersDashboard();
});
