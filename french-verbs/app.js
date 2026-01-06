const subjects = ["Je", "Tu", "Il/Elle", "Nous", "Vous", "Ils/Elles"];

const tenses = ["present", "passe", "imparfait", "futur", "proche"];

const verbs = {
  aller: {
    present: ["vais", "vas", "va", "allons", "allez", "vont"],
    passe: ["suis allé(e)", "es allé(e)", "est allé(e)", "sommes allé(e)s", "êtes allé(e)(s)", "sont allé(e)s"],
    imparfait: ["allais", "allais", "allait", "allions", "alliez", "allaient"],
    futur: ["irai", "iras", "ira", "irons", "irez", "iront"],
    proche: ["vais aller", "vas aller", "va aller", "allons aller", "allez aller", "vont aller"]
  },

  avoir: {
    present: ["ai", "as", "a", "avons", "avez", "ont"],
    passe: ["ai eu", "as eu", "a eu", "avons eu", "avez eu", "ont eu"],
    imparfait: ["avais", "avais", "avait", "avions", "aviez", "avaient"],
    futur: ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
    proche: ["vais avoir", "vas avoir", "va avoir", "allons avoir", "allez avoir", "vont avoir"]
  },

  etre: {
    present: ["suis", "es", "est", "sommes", "êtes", "sont"],
    passe: ["ai été", "as été", "a été", "avons été", "avez été", "ont été"],
    imparfait: ["étais", "étais", "était", "étions", "étiez", "étaient"],
    futur: ["serai", "seras", "sera", "serons", "serez", "seront"],
    proche: ["vais être", "vas être", "va être", "allons être", "allez être", "vont être"]
  },

  faire: {
    present: ["fais", "fais", "fait", "faisons", "faites", "font"],
    passe: ["ai fait", "as fait", "a fait", "avons fait", "avez fait", "ont fait"],
    imparfait: ["faisais", "faisais", "faisait", "faisions", "faisiez", "faisaient"],
    futur: ["ferai", "feras", "fera", "ferons", "ferez", "feront"],
    proche: ["vais faire", "vas faire", "va faire", "allons faire", "allez faire", "vont faire"]
  },

  vouloir: {
    present: ["veux", "veux", "veut", "voulons", "voulez", "veulent"],
    passe: ["ai voulu", "as voulu", "a voulu", "avons voulu", "avez voulu", "ont voulu"],
    imparfait: ["voulais", "voulais", "voulait", "voulions", "vouliez", "voulaient"],
    futur: ["voudrai", "voudras", "voudra", "voudrons", "voudrez", "voudront"],
    proche: ["vais vouloir", "vas vouloir", "va vouloir", "allons vouloir", "allez vouloir", "vont vouloir"]
  },

  dire: {
    present: ["dis", "dis", "dit", "disons", "dites", "disent"],
    passe: ["ai dit", "as dit", "a dit", "avons dit", "avez dit", "ont dit"],
    imparfait: ["disais", "disais", "disait", "disions", "disiez", "disaient"],
    futur: ["dirai", "diras", "dira", "dirons", "direz", "diront"],
    proche: ["vais dire", "vas dire", "va dire", "allons dire", "allez dire", "vont dire"]
  },

  savoir: {
    present: ["sais", "sais", "sait", "savons", "savez", "savent"],
    passe: ["ai su", "as su", "a su", "avons su", "avez su", "ont su"],
    imparfait: ["savais", "savais", "savait", "savions", "saviez", "savaient"],
    futur: ["saurai", "sauras", "saura", "saurons", "saurez", "sauront"],
    proche: ["vais savoir", "vas savoir", "va savoir", "allons savoir", "allez savoir", "vont savoir"]
  },

  mettre: {
    present: ["mets", "mets", "met", "mettons", "mettez", "mettent"],
    passe: ["ai mis", "as mis", "a mis", "avons mis", "avez mis", "ont mis"],
    imparfait: ["mettais", "mettais", "mettait", "mettions", "mettiez", "mettaient"],
    futur: ["mettrai", "mettras", "mettra", "mettrons", "mettrez", "mettront"],
    proche: ["vais mettre", "vas mettre", "va mettre", "allons mettre", "allez mettre", "vont mettre"]
  },

  courir: {
    present: ["cours", "cours", "court", "courons", "courez", "courent"],
    passe: ["ai couru", "as couru", "a couru", "avons couru", "avez couru", "ont couru"],
    imparfait: ["courais", "courais", "courait", "courions", "couriez", "couraient"],
    futur: ["courrai", "courras", "courra", "courrons", "courrez", "courront"],
    proche: ["vais courir", "vas courir", "va courir", "allons courir", "allez courir", "vont courir"]
  },

  apparaitre: {
    present: ["apparais", "apparais", "apparaît", "apparaissons", "apparaissez", "apparaissent"],
    passe: ["ai apparu", "as apparu", "a apparu", "avons apparu", "avez apparu", "ont apparu"],
    imparfait: ["apparaissais", "apparaissais", "apparaissait", "apparaissions", "apparaissiez", "apparaissaient"],
    futur: ["apparaîtrai", "apparaîtras", "apparaîtra", "apparaîtrons", "apparaîtrez", "apparaîtront"],
    proche: ["vais apparaître", "vas apparaître", "va apparaître", "allons apparaître", "allez apparaître", "vont apparaître"]
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
  const verbKeys = Object.keys(verbs);
  const verb = verbKeys[Math.floor(Math.random() * verbKeys.length)];
  const index = Math.floor(Math.random() * subjects.length);

  let tense = tenseEl.value;
  if (tense === "random") {
    tense = tenses[Math.floor(Math.random() * tenses.length)];
  }

  current = {
    answer: verbs[verb][tense][index]
  };

  questionEl.textContent = `${subjects[index]} (${tenseLabel(tense)}) → ${verb}`;
  answerEl.value = "";
  feedbackEl.textContent = "";
  checkBtn.disabled = false;
}

function checkAnswer() {
  const user = answerEl.value.trim().toLowerCase();
  const correct = current.answer.toLowerCase();

  total++;
  checkBtn.disabled = true;

  if (user === correct) {
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
