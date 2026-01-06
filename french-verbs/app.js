const subjects = ["Je", "Tu", "Il/Elle", "Nous", "Vous", "Ils/Elles"];

const verbs = {
  manger: {
    present: ["mange", "manges", "mange", "mangeons", "mangez", "mangent"],
    passe: ["ai mangé", "as mangé", "a mangé", "avons mangé", "avez mangé", "ont mangé"],
    imparfait: ["mangeais", "mangeais", "mangeait", "mangions", "mangiez", "mangeaient"],
    futur: ["mangerai", "mangeras", "mangera", "mangerons", "mangerez", "mangeront"],
    proche: ["vais manger", "vas manger", "va manger", "allons manger", "allez manger", "vont manger"]
  },

  finir: {
    present: ["finis", "finis", "finit", "finissons", "finissez", "finissent"],
    passe: ["ai fini", "as fini", "a fini", "avons fini", "avez fini", "ont fini"],
    imparfait: ["finissais", "finissais", "finissait", "finissions", "finissiez", "finissaient"],
    futur: ["finirai", "finiras", "finira", "finirons", "finirez", "finiront"],
    proche: ["vais finir", "vas finir", "va finir", "allons finir", "allez finir", "vont finir"]
  },

  prendre: {
    present: ["prends", "prends", "prend", "prenons", "prenez", "prennent"],
    passe: ["ai pris", "as pris", "a pris", "avons pris", "avez pris", "ont pris"],
    imparfait: ["prenais", "prenais", "prenait", "prenions", "preniez", "prenaient"],
    futur: ["prendrai", "prendras", "prendra", "prendrons", "prendrez", "prendront"],
    proche: ["vais prendre", "vas prendre", "va prendre", "allons prendre", "allez prendre", "vont prendre"]
  },

  ralentir: {
    present: ["ralentis", "ralentis", "ralentit", "ralentissons", "ralentissez", "ralentissent"],
    passe: ["ai ralenti", "as ralenti", "a ralenti", "avons ralenti", "avez ralenti", "ont ralenti"],
    imparfait: ["ralentissais", "ralentissais", "ralentissait", "ralentissions", "ralentissiez", "ralentissaient"],
    futur: ["ralentirai", "ralentiras", "ralentira", "ralentirons", "ralentirez", "ralentiront"],
    proche: ["vais ralentir", "vas ralentir", "va ralentir", "allons ralentir", "allez ralentir", "vont ralentir"]
  },

  emprunter: {
    present: ["emprunte", "empruntes", "emprunte", "empruntons", "empruntez", "empruntent"],
    passe: ["ai emprunté", "as emprunté", "a emprunté", "avons emprunté", "avez emprunté", "ont emprunté"],
    imparfait: ["empruntais", "empruntais", "empruntait", "empruntions", "empruntiez", "empruntaient"],
    futur: ["emprunterai", "emprunteras", "empruntera", "emprunterons", "emprunterez", "emprunteront"],
    proche: ["vais emprunter", "vas emprunter", "va emprunter", "allons emprunter", "allez emprunter", "vont emprunter"]
  },

  etre: {
    present: ["suis", "es", "est", "sommes", "êtes", "sont"],
    passe: ["ai été", "as été", "a été", "avons été", "avez été", "ont été"],
    imparfait: ["étais", "étais", "était", "étions", "étiez", "étaient"],
    futur: ["serai", "seras", "sera", "serons", "serez", "seront"],
    proche: ["vais être", "vas être", "va être", "allons être", "allez être", "vont être"]
  },

  venir: {
    present: ["viens", "viens", "vient", "venons", "venez", "viennent"],
    passe: ["suis venu(e)", "es venu(e)", "est venu(e)", "sommes venu(e)s", "êtes venu(e)(s)", "sont venu(e)s"],
    imparfait: ["venais", "venais", "venait", "venions", "veniez", "venaient"],
    futur: ["viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront"],
    proche: ["vais venir", "vas venir", "va venir", "allons venir", "allez venir", "vont venir"]
  }
};

let current = {};
let score = 0;
let total = 0;

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const tenseEl = document.getElementById("tense");
const checkBtn = document.getElementById("check");

checkBtn.addEventListener("click", checkAnswer);

function newQuestion() {
  const verbList = Object.keys(verbs);
  const verb = verbList[Math.floor(Math.random() * verbList.length)];
  const tense = tenseEl.value;
  const index = Math.floor(Math.random() * subjects.length);

  current = {
    answer: verbs[verb][tense][index]
  };

  questionEl.textContent = `${subjects[index]} (${tenseLabel(tense)}) → ${verb}`;
  answerEl.value = "";
  feedbackEl.textContent = "";
  checkBtn.disabled = false;
}

function checkAnswer() {
  const userAnswer = answerEl.value.trim().toLowerCase();
  const correct = current.answer.toLowerCase();

  total++;
  checkBtn.disabled = true;

  if (userAnswer === correct) {
    score++;
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.className = "feedback correct";
  } else {
    feedbackEl.textContent = `❌ Correct answer: ${current.answer}`;
    feedbackEl.className = "feedback wrong";
  }

  scoreEl.textContent = `Score: ${score} / ${total}`;

  setTimeout(newQuestion, 2000);
}

function tenseLabel(key) {
  return {
    present: "Présent",
    passe: "Passé composé",
    imparfait: "Imparfait",
    futur: "Futur simple",
    proche: "Futur proche"
  }[key];
}

newQuestion();
