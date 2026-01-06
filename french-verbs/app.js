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
  aller: {
    present: ["vais", "vas", "va", "allons", "allez", "vont"],
    passe: ["suis allé(e)", "es allé(e)", "est allé(e)", "sommes allé(e)s", "êtes allé(e)(s)", "sont allé(e)s"],
    imparfait: ["allais", "allais", "allait", "allions", "alliez", "allaient"],
    futur: ["irai", "iras", "ira", "irons", "irez", "iront"],
    proche: ["vais aller", "vas aller", "va aller", "allons aller", "allez aller", "vont aller"]
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

document.getElementById("check").addEventListener("click", checkAnswer);

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
}

function checkAnswer() {
  const userAnswer = answerEl.value.trim().toLowerCase();
  total++;

  if (userAnswer === current.answer.toLowerCase()) {
    score++;
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.className = "feedback correct";
  } else {
    feedbackEl.textContent = `❌ ${current.answer}`;
    feedbackEl.className = "feedback wrong";
  }

  scoreEl.textContent = `Score: ${score} / ${total}`;
  setTimeout(newQuestion, 1200);
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
