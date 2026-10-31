/**
 * EPL Matchday Gate - Firebase Service & Integration
 * تذكرتي دوري نايل - ربط المشروع مع Google Firebase
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  setDoc,
  doc, 
  getDoc, 
  getDocs,
  query,
  where,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

// Firebase Configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyDl6z38CiQd8VCwryB0LA2lu00O2OeSwac",
  authDomain: "test-d32ef.firebaseapp.com",
  projectId: "test-d32ef",
  storageBucket: "test-d32ef.firebasestorage.app",
  messagingSenderId: "258048441856",
  appId: "1:258048441856:web:1ea8e3715ae3d341ff62e5",
  measurementId: "G-ZNN94RVR4M"
};

// Initialize Firebase
let app = null;
let analytics = null;
let db = null;

try {
  app = initializeApp(firebaseConfig);
  // Analytics is only supported in browser environment with cookies enabled
  try {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized successfully");
  } catch (e) {
    console.warn("Firebase Analytics could not be initialized in this environment:", e);
  }
  
  db = getFirestore(app);
  console.log("Firebase & Firestore initialized successfully:", firebaseConfig.projectId);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

// Global Firebase Helper Object for seamless access across standard scripts
window.EPL_FIREBASE = {
  app,
  analytics,
  db,
  isAvailable: !!app,

  // Log analytics events safely
  logEvent: (eventName, params = {}) => {
    try {
      if (analytics) {
        logEvent(analytics, eventName, params);
      }
    } catch (err) {
      console.warn("Analytics logEvent error:", err);
    }
  },

  // Save ticket booking to Firestore
  saveTicketToFirestore: async (bookingData) => {
    if (!db) {
      console.warn("Firestore not initialized, falling back to local storage");
      return null;
    }

    try {
      const ticketsRef = collection(db, "tickets");
      const docPayload = {
        ...bookingData,
        firebaseTimestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      };

      // Add to 'tickets' collection
      const docRef = await addDoc(ticketsRef, docPayload);
      console.log("Ticket successfully saved to Firestore with ID:", docRef.id);
      
      // Also track analytics event for ticket purchase
      if (analytics) {
        logEvent(analytics, "purchase", {
          transaction_id: bookingData.reference,
          value: bookingData.price,
          currency: "EGP",
          items: [{
            item_id: bookingData.seat,
            item_name: bookingData.matchTitle,
            item_category: bookingData.sector,
            quantity: bookingData.quantity || 1,
            price: bookingData.price
          }]
        });
      }

      return docRef.id;
    } catch (error) {
      console.warn("Firestore saveTicket error (will retain local copy):", error);
      return null;
    }
  },

  // Fetch ticket by reference code (e.g. #EPL-2025-88492)
  getTicketByReference: async (reference) => {
    if (!db) return null;

    try {
      const ticketsRef = collection(db, "tickets");
      const q = query(ticketsRef, where("reference", "==", reference));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.warn("Error fetching ticket from Firestore:", error);
      return null;
    }
  },

  // Verify Fan ID in Firebase
  verifyFanId: async (fanId) => {
    try {
      if (analytics) {
        logEvent(analytics, "search", {
          search_term: fanId,
          content_type: "fan_id_verification"
        });
      }

      if (!db) return null;

      const fansRef = collection(db, "fans");
      const q = query(fansRef, where("fanId", "==", fanId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.warn("Fan ID verification query note:", error);
      return null;
    }
  },

  // Fetch all tickets/orders for Dashboard
  getAllTicketsFromFirestore: async () => {
    if (!db) return [];
    try {
      const ticketsRef = collection(db, "tickets");
      const snapshot = await getDocs(ticketsRef);
      const list = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      return list;
    } catch (error) {
      console.warn("Error fetching all tickets from Firestore:", error);
      return [];
    }
  },

  // Update ticket status in Firestore
  updateTicketStatus: async (ticketDocId, status) => {
    if (!db) return false;
    try {
      const ticketRef = doc(db, "tickets", ticketDocId);
      await setDoc(ticketRef, { status: status }, { merge: true });
      return true;
    } catch (error) {
      console.warn("Error updating ticket status in Firestore:", error);
      return false;
    }
  }
};

// Dispatch a ready event so other scripts know Firebase is loaded
window.dispatchEvent(new CustomEvent("firebase-ready", { detail: { app, db, analytics } }));
