const subjects = ["Je", "Tu", "Il/Elle", "Nous", "Vous", "Ils/Elles"];

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
  souhaiter: {
    present: ["souhaite", "souhaites", "souhaite", "souhaitons", "souhaitez", "souhaitent"],
    passe: ["ai souhaité", "as souhaité", "a souhaité", "avons souhaité", "avez souhaité", "ont souhaité"],
    imparfait: ["souhaitais", "souhaitais", "souhaitait", "souhaitions", "souhaitiez", "souhaitaient"],
    futur: ["souhaiterai", "souhaiteras", "souhaitera", "souhaiterons", "souhaiterez", "souhaiteront"],
    proche: ["vais souhaiter", "vas souhaiter", "va souhaiter", "allons souhaiter", "allez souhaiter", "vont souhaiter"]
  },
  asseoir: {
    present: ["assieds", "assieds", "assied", "asseyons", "asseyiez", "asseyent"],
    passe: ["ai assis", "as assis", "a assis", "avons assis", "avez assis", "ont assis"],
    imparfait: ["asseyais", "asseyais", "asseyait", "asseyions", "asseyiez", "asseyaient"],
    futur: ["assiérai", "assiéras", "assiéra", "assiérons", "assiérez", "assiéront"],
    proche: ["vais asseoir", "vas asseoir", "va asseoir", "allons asseoir", "allez asseoir", "vont asseoir"]
  },
  "se lever": {
    present: ["me lève", "te lèves", "se lève", "nous levons", "vous levez", "se lèvent"],
    passe: ["me suis levé(e)", "t'es levé(e)", "s'est levé(e)", "nous sommes levé(e)s", "vous êtes levé(e)(s)", "se sont levé(e)s"],
    imparfait: ["me levais", "te levais", "se levait", "nous levions", "vous leviez", "se levaient"],
    futur: ["me lèverai", "te lèveras", "se lèvera", "nous lèverons", "vous lèverez", "se lèveront"],
    proche: ["vais me lever", "vas te lever", "va se lever", "allons nous lever", "allez vous lever", "vont se lever"]
  },
  "se souvenir": {
    present: ["me souviens", "te souviens", "se souvient", "nous souvenons", "vous souvenez", "se souviennent"],
    passe: ["me suis souvenu(e)", "t'es souvenu(e)", "s'est souvenu(e)", "nous sommes souvenu(e)s", "vous êtes souvenu(e)(s)", "se sont souvenu(e)s"],
    imparfait: ["me souvenais", "te souvenais", "se souvenait", "nous souvenions", "vous souveniez", "se souvenaient"],
    futur: ["me souviendrai", "te souviendrai", "se souviendra", "nous souviendrons", "vous souviendrez", "se souviendront"],
    proche: ["vais me souvenir", "vas te souvenir", "va se souvenir", "allons nous souvenir", "allez vous souvenir", "vont se souvenir"]
  },
  soulever: {
    present: ["soulève", "soulèves", "soulève", "soulevons", "soulevez", "soulèvent"],
    passe: ["ai soulevé", "as soulevé", "a soulevé", "avons soulevé", "avez soulevé", "ont soulevé"],
    imparfait: ["soulevais", "soulevais", "soulevait", "soulevions", "souleviez", "soulevaient"],
    futur: ["soulèverai", "soulèveras", "soulèvera", "souleverons", "souleverez", "soulèveront"],
    proche: ["vais soulever", "vas soulever", "va soulever", "allons soulever", "allez soulever", "vont soulever"]
  },
  ralentir: {
    present: ["ralentis", "ralentis", "ralentit", "ralentissons", "ralentissez", "ralentissent"],
    passe: ["ai ralenti", "as ralenti", "a ralenti", "avons ralenti", "avez ralenti", "ont ralenti"],
    imparfait: ["ralentissais", "ralentissais", "ralentissait", "ralentissions", "ralentissiez", "ralentissaient"],
    futur: ["ralentirai", "ralentiras", "ralentira", "ralentirons", "ralentirez", "ralentiront"],
    proche: ["vais ralentir", "vas ralentir", "va ralentir", "allons ralentir", "allez ralentir", "vont ralentir"]
  },
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
  emprunter: {
    present: ["emprunte", "empruntes", "emprunte", "empruntons", "empruntez", "empruntent"],
    passe: ["ai emprunté", "as emprunté", "a emprunté", "avons emprunté", "avez emprunté", "ont emprunté"],
    imparfait: ["empruntais", "empruntais", "empruntait", "empruntions", "empruntiez", "empruntaient"],
    futur: ["emprunterai", "emprunteras", "empruntera", "emprunterons", "emprunterez", "emprunteront"],
    proche: ["vais emprunter", "vas emprunter", "va emprunter", "allons emprunter", "allez emprunter", "vont emprunter"]
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
  
  // Logic to handle "random" tense if you add it to the dropdown later
  let tense = tenseEl.value;
  if (tense === "random") {
    const tenses = ["present", "passe", "imparfait", "futur", "proche"];
    tense = tenses[Math.floor(Math.random() * tenses.length)];
  }

  const index = Math.floor(Math.random() * subjects.length);

  current = {
    answer: verbs[verb][tense][index]
  };

  questionEl.textContent = `${subjects[index]} (${tenseLabel(tense)}) → ${verb}`;
  answerEl.value = "";
  feedbackEl.textContent = "";
  checkBtn.disabled = false;
  
  // Focus the input automatically so you can keep typing
  answerEl.focus(); 
}

// Allow pressing "Enter" to check answer
answerEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !checkBtn.disabled) {
    checkAnswer();
  }
});

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
