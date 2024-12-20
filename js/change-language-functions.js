var languageContent = {
  greek: {
    languageBtn: "EL",
    mainTitle: "Εγγραφή Διακριθέντων Αθλητών στον Ειδικό Πίνακα Διακρίσεων της Γενικής Γραμματείας Αθλητισμού",
    pageTitle: "Εγγραφή Διακριθέντων Αθλητών στον Ειδικό Πίνακα Διακρίσεων της Γενικής Γραμματείας Αθλητισμού",
    infoTitle: "Πληροφορίες για την Εγγραφή Διακριθέντων Αθλητών στον Ειδικό Πίνακα Διακρίσεων της Γενικής Γραμματείας Αθλητισμού",
    subTitle1: "Αυτό το ερωτηματολόγιο μπορεί να σας βοηθήσει να εγγραφείτε στον Ειδικό Πίνακα Διακρίσεων της Γενικής Γραμματείας Αθλητισμού",
    subTitle2: "H συμπλήρωση του ερωτηματολογίου δεν απαιτεί παραπάνω από 10 λεπτά.",
    subTitle3: "Δεν θα αποθηκεύσουμε ούτε θα μοιραστούμε τις απαντήσεις σας.",
    backButton: "Πίσω",
    nextQuestion: "Επόμενη ερώτηση",
    biggerCursor: "Μεγαλύτερος Δρομέας",
    bigFontSize: "Μεγάλο Κείμενο",
    readAloud: "Ανάγνωση",
    changeContrast: "Αντίθεση",
    readingMask: "Μάσκα Ανάγνωσης",
    footerText: "Αυτό το έργο δημιουργήθηκε για τις ανάγκες της πτυχιακής μας εργασίας κατά τη διάρκεια των προπτυχιακών μας σπουδών στο Πανεπιστήμιο Μακεδονίας. Η ομάδα μας αποτελείται από 2 φοιτήτριες της Εφαρμοσμένης Πληροφορικής:",
    and: "και",
    student1: "Αμπατζίδου Ελισάβετ",
    student2: "Δασύρα Ευμορφία Ελπίδα",
    startBtn:"Ας ξεκινήσουμε",
    chooseAnswer: "Επιλέξτε την απάντησή σας",
    oneAnswer: "Μπορείτε να επιλέξετε μόνο μία επιλογή.",
    errorAn: "Λάθος:",
    choose: "Πρέπει να επιλέξετε μια απάντηση",
  },
  english: {
    languageBtn: "EN",
    mainTitle: "Registration of Distinguished Athletes in the Special Table of Distinctions of the General Secretariat of Sports.",
    pageTitle: "Registration of Distinguished Athletes in the Special Table of Distinctions of the General Secretariat of Sports.",
    infoTitle: "Information on the Registration of Distinguished Athletes in the Special Table of Distinctions of the General Secretariat of Sports.",
    subTitle1: "This questionnaire can help you register for the Special Table of Distinctions of the General Secretariat of Sports.",
    subTitle2: "Completing the questionnaire should not take more than 10 minutes.",
    subTitle3: "We will neither store nor share your answers.",
    backButton: "Βack",
    nextQuestion: "Next Question",
    biggerCursor: "Bigger Cursor",
    bigFontSize:" Big Font Size",
    readAloud: "Read Aloud",
    changeContrast:" Change Contrast",
    readingMask:" Reading Mask",
    footerText: "This project was created for the needs of our thesis at the University of Macedonia. Our team consists of 2 students of Applied Informatics:",
    and: "and",
    student1: "Ampatzidou Elisavet",
    student2: "Dasyra Evmorfia Elpida",
    startBtn:"Let's start",
    chooseAnswer: "Choose your answer",
    oneAnswer: "You can choose only one option.",
    errorAn: "Error:",
    choose: "You must choose one option",
  }
};

// Retrieve the selected language from localStorage or set default to "greek"
var currentLanguage = localStorage.getItem("preferredLanguage") || "greek";

function toggleLanguage() {
  currentLanguage = currentLanguage === "greek" ? "english" : "greek";
  localStorage.setItem("preferredLanguage", currentLanguage);
  updateContent();
}

function updateContent() {
  var components = document.querySelectorAll(".language-component");
   
  components.forEach(function (component) {
      var componentName = component.dataset.component;
      component.textContent = languageContent[currentLanguage][componentName];
  });
}

// Initialize the content based on the selected language
updateContent();