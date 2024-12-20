$("document").ready(function () {
  var currentQuestion = 0;
  var totalQuestions = 0;
  var userAnswers = {};
  var all_questions;
  var all_questions_en;
  var all_evidences;
  var all_evidences_en;
  var faq;
  var faq_en;

  //hide the form buttons when its necessary
  function hideFormBtns() {
    $("#nextQuestion").hide();
    $("#backButton").hide();
  }

  //Once the form begins, the questions' data and length are fetched.
  function getQuestions() {
    return fetch("question-utils/all-questions.json")
      .then((response) => response.json())
      .then((data) => {
        all_questions = data;
        totalQuestions = data.length;

        // Fetch the second JSON file
        return fetch("question-utils/all-questions-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_questions_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch all-questions-en.json:", error);

            // Show error message to the user
            const errorMessage = document.createElement("div");
            errorMessage.textContent =
              "Error: Failed to fetch all-questions-en.json.";
            $(".question-container").html(errorMessage);

            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch all-questions:", error);

        // Show error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch all-questions.json.";
        $(".question-container").html(errorMessage);

        hideFormBtns();
      });
  }

  //Once the form begins, the evidences' data and length are fetched.
  function getEvidences() {
    return fetch("question-utils/cpsv.json")
      .then((response) => response.json())
      .then((data) => {
        all_evidences = data;
        totalEvidences = data.length;

        // Fetch the second JSON file
        return fetch("question-utils/cpsv-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_evidences_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch cpsv-en:", error);

            // Show error message to the user
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error: Failed to fetch cpsv-en.json.";
            $(".question-container").html(errorMessage);

            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch cpsv:", error);

        // Show error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch cpsv.json.";
        $(".question-container").html(errorMessage);

        hideFormBtns();
      });
  }

  //Once the form begins, the faqs' data is fetched.
  function getFaq() {
    return fetch("question-utils/faq.json")
      .then((response) => response.json())
      .then((data) => {
        faq = data;
        totalFaq = data.length;

        // Fetch the second JSON file
        return fetch("question-utils/faq-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            faq_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch faq-en:", error);
            // Show error message to the user
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error: Failed to fetch faq-en.json.";
            $(".question-container").html(errorMessage);
          });
      })
      .catch((error) => {
        console.error("Failed to fetch faq:", error);
        // Show error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch faq.json.";
        $(".question-container").html(errorMessage);
      });
  }

  function getEvidencesById(id) {
    var selectedEvidence;
    currentLanguage === "greek"
      ? (selectedEvidence = all_evidences)
      : (selectedEvidence = all_evidences_en);
    selectedEvidence = selectedEvidence.PublicService.evidence.find(
      (evidence) => evidence.id === id
    );

    if (selectedEvidence) {
      const evidenceListElement = document.getElementById("evidences");
      selectedEvidence.evs.forEach((evsItem) => {
        const listItem = document.createElement("li");
        listItem.textContent = evsItem.name;
        evidenceListElement.appendChild(listItem);
      });
    } else {
      console.log(`Evidence with ID '${givenEvidenceID}' not found.`);
    }
  }

  //text added in the final result
  function setResult(text) {
    const resultWrapper = document.getElementById("resultWrapper");
    const result = document.createElement("h5");
    result.textContent = text;
    resultWrapper.appendChild(result);
  }

  function loadFaqs() {
    var faqData = currentLanguage === "greek" ? faq : faq_en;
    var faqTitle =
      currentLanguage === "greek"
        ? "Συχνές Ερωτήσεις"
        : "Frequently Asked Questions";

    var faqElement = document.createElement("div");

    faqElement.innerHTML = `
        <div class="govgr-heading-m language-component" data-component="faq" tabIndex="15">
          ${faqTitle}
        </div>
    `;

    var ft = 16;
    faqData.forEach((faqItem) => {
      var faqSection = document.createElement("details");
      faqSection.className = "govgr-accordion__section";
      faqSection.tabIndex = ft;

      faqSection.innerHTML = `
        <summary class="govgr-accordion__section-summary">
          <h2 class="govgr-accordion__section-heading">
            <span class="govgr-accordion__section-button">
              ${faqItem.question}
            </span>
          </h2>
        </summary>
        <div class="govgr-accordion__section-content">
          <p class="govgr-body">
          ${convertURLsToLinks(faqItem.answer)}
          </p>
        </div>
      `;

      faqElement.appendChild(faqSection);
      ft++;
    });

    $(".faqContainer").html(faqElement);
  }

  // get the url from faqs and link it
  function convertURLsToLinks(text) {
    return text.replace(
      /https:\/\/www\.gov\.gr\/[\S]+/g,
      '<a href="$&" target="_blank">' + "myKEPlive" + "</a>" + "."
    );
  }


  //Εachtime back/next buttons are pressed the form loads a question
  function loadQuestion(questionId, noError) {
    // Show navigation buttons by default
    $("#nextQuestion").show();
    if (currentQuestion > 0) {
      $("#backButton").show();
    }

    // Get the current question based on language
    let question = currentLanguage === "greek"
      ? all_questions.find(q => q.id === questionId)
      : all_questions_en.find(q => q.id === questionId);

    // Check if question exists
    if (!question) {
      console.error(`Question with ID ${questionId} not found`);
      const errorMessage = document.createElement("div");
      errorMessage.textContent = currentLanguage === "greek"
        ? "Σφάλμα: Η ερώτηση δεν βρέθηκε."
        : "Error: Question not found.";
      $(".question-container").html(errorMessage);
      hideFormBtns();
      return;
    }

    // Handle end states
    if (questionId === "END_NO" || questionId === "END_YES") {
      const endMessage = document.createElement("div");
      endMessage.className = "govgr-heading-l";
      endMessage.textContent = question.question;
      $(".question-container").html(endMessage);
      hideFormBtns();
      return;
    }

    var questionElement = document.createElement("div");

    if (noError) {
      questionElement.innerHTML = `
      <div class='govgr-field'>
        <fieldset class='govgr-fieldset' aria-describedby='radio-country'>
          <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
            ${question.question}
          </legend>
          <div class='govgr-radios' id='radios-${questionId}'>
            ${question.options.map((option) => `
              <div class='govgr-radios__item'>
                <label class='govgr-label govgr-radios__label'>
                  ${option}
                  <input class='govgr-radios__input' type='radio' name='question-option' value='${option}' />
                </label>
              </div>
            `).join("")}
          </div>
        </fieldset>
      </div>
    `;
    } else {
      // Error state HTML (keeping your existing error HTML structure)
      questionElement.innerHTML = `
        <div class='govgr-field govgr-field__error' id='$id-error'>
          <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
            ${question.question}
          </legend>
          <fieldset class='govgr-fieldset' aria-describedby='radio-error'>
            <legend class='govgr-fieldset__legend govgr-heading-m language-component' data-component='chooseAnswer'>
              ${currentLanguage === "greek" ? "Επιλέξτε την απάντησή σας" : "Choose your answer"}
            </legend>
            <p class='govgr-hint language-component' data-component='oneAnswer'>
              ${currentLanguage === "greek" ? "Μπορείτε να επιλέξετε μόνο μία επιλογή." : "You can choose only one option."}
            </p>
            <div class='govgr-radios'>
              <p class='govgr-error-message'>
                <span class='govgr-visually-hidden language-component' data-component='errorAn'>
                  ${currentLanguage === "greek" ? "Λάθος:" : "Error:"}
                </span>
                <span class='language-component' data-component='choose'>
                  ${currentLanguage === "greek" ? "Πρέπει να επιλέξετε μια απάντηση" : "You must choose an answer"}
                </span>
              </p>
              ${question.options.map((option) => `
                <div class='govgr-radios__item'>
                  <label class='govgr-label govgr-radios__label'>
                    ${option}
                    <input class='govgr-radios__input' type='radio' name='question-option' value='${option}' />
                  </label>
                </div>
              `).join("")}
            </div>
          </fieldset>
        </div>
      `;
    }

    $(".question-container").html(questionElement);
  }

  function skipToEnd(message) {
    const errorEnd = document.createElement("h5");
    const error =
      currentLanguage === "greek"
        ? "Λυπούμαστε αλλά δεν δικαιούστε το δελτίο μετακίνησης ΑΜΕΑ!"
        : "We are sorry but you are not entitled to the transportation card for the disabled!";
    errorEnd.className = "govgr-error-summary";
    errorEnd.textContent = error + " " + message;
    $(".question-container").html(errorEnd);
    hideFormBtns();
  }

  $("#startBtn").click(function () {
    $("#intro").html("");
    $("#languageBtn").hide();
    $("#questions-btns").show();
  });

  function retrieveAnswers() {
    var allAnswers = [];
    // currentLanguage === "greek" ? result = "Πρέπει να υποβάλετε id1": result = "You must submit id1";

    getEvidencesById(1);
    for (var i = 0; i < totalQuestions; i++) {
      var answer = sessionStorage.getItem("answer_" + i);
      allAnswers.push(answer);
    }
    if (allAnswers[0] === "2") {
      getEvidencesById(9);
    }
    if (allAnswers[2] === "4") {
      getEvidencesById(11);
    }
    if (allAnswers[4] === "1") {
      getEvidencesById(6);
    } else if (allAnswers[4] === "2") {
      getEvidencesById(7);
    } else if (allAnswers[4] === "3") {
      getEvidencesById(8);
    }
    if (
      allAnswers[5] === "1" ||
      (allAnswers[5] === "2")
    ) {
      getEvidencesById(10);
      currentLanguage === "greek"
        ? setResult("Δικαιούται και ο συνοδός το ίδιο δελτίο μετακίνησης.")
        : setResult("The companion is also entitled with the same transportation card.");
    }

    if (allAnswers[6] === "2") {
      getEvidencesById(3);
      getEvidencesById(4);
    } else if (allAnswers[6] === "3") {
      getEvidencesById(3);
      getEvidencesById(5);
    }
    if (allAnswers[7] === "1") {
      getEvidencesById(12);
      currentLanguage === "greek"
        ? setResult(
          "Δικαιούστε έκπτωση 50% για τις εκτός ορίων της περιφέρειας σας μετακινήσεις με υπεραστικά ΚΤΕΛ."
        )
        : setResult(
          "You are entitled to a 50% discount for transportation outside the boundaries of your region with long-distance bus services (named KTEL)."
        );
    } else if (allAnswers[7] === "2" && allAnswers[5] !== "1") {
      getEvidencesById(2);
      if (allAnswers[8] === "1") {
        currentLanguage === "greek"
          ? setResult(
            "Δικαιούσαι δωρεάν μετακίνησης με τα αστικά μέσα συγκοινωνίας της περιφέρειας σου και έκπτωση 50% για τις εκτός ορίων της περιφέρειας σου μετακινήσεις με υπεραστικά ΚΤΕΛ."
          )
          : setResult(
            "You are entitled to free transportation with the urban public bus of your region and a 50% discount for transportation outside the boundaries of your region with long-distance (intercity) bus services (named KTEL)."
          );
      } else if (allAnswers[8] === "2") {
        currentLanguage === "greek"
          ? setResult(
            "Δικαιούσαι έκπτωση 50% για τις εκτός ορίων της περιφέρειας σου μετακινήσεις με υπεραστικά ΚΤΕΛ."
          )
          : setResult(
            "You are entitled to a 50% discount for transportation outside the boundaries of your region with long-distance bus services (named KTEL)."
          );
      }
    }
    else if (allAnswers[7] === "2" && allAnswers[5] === "1") {
      currentLanguage === "greek"
        ? setResult(
          "Δικαιούσαι δωρεάν μετακίνησης με τα αστικά μέσα συγκοινωνίας της περιφέρειας σου και έκπτωση 50% για τις εκτός ορίων της περιφέρειας σου μετακινήσεις με υπεραστικά ΚΤΕΛ."
        )
        : setResult(
          "You are entitled to free transportation with the urban public bus of your region and a 50% discount for transportation outside the boundaries of your region with long-distance (intercity) bus services (named KTEL)."
        );
    }
  }

  function submitForm() {
    const resultWrapper = document.createElement("div");
    const titleText =
      currentLanguage === "greek"
        ? "Είστε δικαιούχος!"
        : "You are eligible!";
    resultWrapper.innerHTML = `<h1 class='answer'>${titleText}</h1>`;
    resultWrapper.setAttribute("id", "resultWrapper");
    $(".question-container").html(resultWrapper);

    const evidenceListElement = document.createElement("ol");
    evidenceListElement.setAttribute("id", "evidences");
    currentLanguage === "greek"
      ? $(".question-container").append(
        "<br /><br /><h5 class='answer'>Τα δικαιολογητικά που πρέπει να προσκομίσετε για να λάβετε το δελτίο μετακίνησης είναι τα εξής:</h5><br />"
      )
      : $(".question-container").append(
        "<br /><br /><h5 class='answer'>The documents you need to provide in order to receive your transportation card are the following:</h5><br />"
      );
    $(".question-container").append(evidenceListElement);
    // $("#faqContainer").load("faq.html");
    retrieveAnswers();
    hideFormBtns();
  }

  $("#nextQuestion").click(function () {
    if ($(".govgr-radios__input").is(":checked")) {
      const selectedOption = $('input[name="question-option"]:checked').val();
      // Use the correct question data based on language
      const questions = currentLanguage === "greek" ? all_questions : all_questions_en;
      const currentQuestionData = questions.find(q => q.id === currentQuestion);

      if (!currentQuestionData) {
        console.error(`No question found for ID: ${currentQuestion}`);
        return;
      }

      const nextQuestionId = currentQuestionData.next[selectedOption];

      if (nextQuestionId) {
        currentQuestion = nextQuestionId;
        loadQuestion(currentQuestion, true);
      } else {
        submitForm();
      }
    } else {
      loadQuestion(currentQuestion, false);
    }
  });


  $("#backButton").click(function () {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion(currentQuestion, true);

      // Retrieve the answer for the previous question from userAnswers
      var answer = userAnswers[currentQuestion];
      if (answer) {
        $('input[name="question-option"][value="' + answer + '"]').prop(
          "checked",
          true
        );
      }
    }
  });

  $("#languageBtn").click(function () {
    toggleLanguage();
    loadFaqs();
    // if is false only when the user is skipedToEnd and trying change the language
    if (currentQuestion >= 0 && currentQuestion < totalQuestions - 1)
      loadQuestion(currentQuestion, true);
  });

  $("#questions-btns").hide();

  // Get all questions
  getQuestions().then(() => {
    // Get all evidences
    getEvidences().then(() => {
      // Get all faqs 
      getFaq().then(() => {
        // Code inside this block executes only after all data is fetched
        // load  faqs and the first question on page load
        loadFaqs();
        $("#faqContainer").show();
        loadQuestion(currentQuestion, true);
      });
    });
  });
});
