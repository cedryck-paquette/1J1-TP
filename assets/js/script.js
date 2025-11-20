//-----------VARIABLES GÉNÉRALES---------------

//Canvas
const oCanvasHTML = document.querySelector("canvas");
const oContexte = oCanvasHTML.getContext("2d");
const nLargeur = oCanvasHTML.width;
const nHauteur = oCanvasHTML.height;

//état jeu
let sEtatJeu = "intro"; //Intro, choixDiff, jeu, fin

//clic dans niveau
let clicJeu = null;
let choix1 = null;
let choix2 = null;

//var niveaux
let niv = 1;
let chances = 2;

//----------------------Images--------------------
//fonds
let oFond = {
  x: 0,
  y: 0,
  h: oCanvasHTML.height,
  l: oCanvasHTML.width,
  image: new Image(),
  introSrc: "assets/images/imageIntro.jpg",
  choixDiffSrc: "assets/images/fondChoixDiff.jpg",
  videSrc: "assets/images/fondVide.jpg",
  ecranNiveauSrc: "assets/images/ecranNiveau.png",
};

//boutons
let oBoutonDebut = new Image();
oBoutonDebut.src = "assets/images/boutonDebuter.png";

let oBoutonAcceuil = new Image();
oBoutonAcceuil.src = "assets/images/boutonAcceuil.png";

let oBoutonAdd = new Image();
oBoutonAdd.src = "assets/images/boutonPlus.png";

let oBoutonSous = new Image();
oBoutonSous.src = "assets/images/boutonMoins.png";

let oBoutonMult = new Image();
oBoutonMult.src = "assets/images/boutonMult.png";

let oBoutonDiv = new Image();
oBoutonDiv.src = "assets/images/boutonDiv.png";

let oBoutonEgal = new Image();
oBoutonEgal.src = "assets/images/boutonEgal.png";

//Variables danimation
let minuterie = 0;
let aLargeurs = [0, 60, 60, 60, 55, 60, 60, 65, 60, 60, 20, 55, 55];
let posCurseur = 0;
let pointDepart = 165;
let largeurTotale = 670;

//-------------------------Sons--------------------
let sons = {
  bonneReponse: new Audio("assets/audio/bonneReponse.wav"),
  click: new Audio("assets/audio/Click.wav"),
  diffComplete: new Audio("assets/audio/diffCompletee.wav"),
  mauvaiseReponse: new Audio("assets/audio/mauvaiseReponse.wav"),
};

//---------------------équations---------------------
//
//
//
//----------------------FONCTIONS--------------------------------

//init
function init() {
  setInterval(boucleJeu, 1000 / 60);
  oCanvasHTML.addEventListener("click", onClicCanvas);
}

//reinit
function reinit() {
  oContexte.clearRect(0, 0, nLargeur, nHauteur);
  sEtatJeu = "intro";
}

//clic
function onClicCanvas(evenement) {
  //coord clic
  curseurX = evenement.offsetX;
  curseurY = evenement.offsetY;

  //entrer dans jeu
  if (sEtatJeu == "intro" && curseurX >= 650 && curseurX <= 900 && curseurY >= 450 && curseurY <= 600) {
    sEtatJeu = "choixDiff";
  }

  //ecran choix difficulté
  else if (sEtatJeu == "choixDiff") {
    //choix facile
    if (curseurX >= 750 && curseurX <= 900 && curseurY >= 250 && curseurY <= 350) {
      sEtatJeu = "facile";
      demarrerFacile();
    }

    //choix moyen
    else if (curseurX >= 750 && curseurX <= 900 && curseurY >= 400 && curseurY <= 500) {
      sEtatJeu = "moyen";
      demarrerMoyen();
    }

    //choix difficile
    else if (curseurX >= 750 && curseurX <= 900 && curseurY >= 550 && curseurY <= 650) {
      sEtatJeu = "difficile";
      demarrerDifficile();
    }
  }
  //retour à l'acceuil
  if (sEtatJeu != "intro") {
    if (curseurX >= 875 && curseurX <= 975 && curseurY >= 25 && curseurY <= 125) {
      reinit();
    }
  }

  //-------------------------------choix dans jeu------------------------

  if (sEtatJeu == "facile" || sEtatJeu == "moyen" || sEtatJeu == "difficile") {
    if (curseurX >= 175 && curseurX <= 295 && curseurY >= 375 && curseurY <= 495) {
      clicJeu = "+";
    } else if (curseurX >= 325 && curseurX <= 445 && curseurY >= 375 && curseurY <= 495) {
      clicJeu = "-";
    } else if (curseurX >= 475 && curseurX <= 595 && curseurY >= 375 && curseurY <= 495) {
      clicJeu = "*";
    } else if (curseurX >= 620 && curseurX <= 740 && curseurY >= 375 && curseurY <= 495) {
      clicJeu = "/";
    } else if (curseurX >= 770 && curseurX <= 920 && curseurY >= 375 && curseurY <= 675) {
      clicJeu = "=";
    }
  }
  //stockage clics dans choix
  //choix1
  if (choix1 == null && choix2 == null) {
    if (clicJeu != "=") {
      choix1 = clicJeu;
    } else if (clicJeu == "=") {
      //erreur si = est le premier choix
      afficherErreur();
    }
    //choix2
  } else if (choix1 != null && choix2 == null) {
    if (clicJeu != "=") {
      choix2 = clicJeu;
    } else if (clicJeu == "=") {
      //erreur si = est le deuxieme choix
      afficherErreur();
    }

    //validation
  } else if (choix1 != null && choix2 != null) {
    if (clicJeu == "=") {
      //si les deux choix sont faits, on valide lorsqu'on clic sur =
      validerReponse();
    } else if (clicJeu != "=") {
      afficherErreur();
    }
  }
  console.log(choix1);
  console.log(choix2);
}

//----------------------------------------BOUCLE JEU----------------------------------------------------
function boucleJeu() {
  if (sEtatJeu == "intro") {
    afficherIntro();
  } else if (sEtatJeu == "choixDiff") {
    afficherChoixDiff();
  } else if (sEtatJeu == "facile" || "moyen" || "difficile") {
    afficherNiveau();

    if (sEtatJeu == "facile") {
      demarrerFacile();
    } else if (sEtatJeu == "moyen") {
      demarrerMoyen();
    } else if (sEtatJeu == "difficile") {
      demarrerDifficile();
    }
  }
}

//----------------------------------FONCTIONS DIFFICULTÉS---------------------------------------

function demarrerFacile() {}

function demarrerMoyen() {}

function demarrerDifficile() {}

function validerReponse() {
  //facile
  if (sEtatJeu == "facile") {
    if (niv == 1) {
      if (choix1 == "*" && choix2 == "+") {
        afficherReussi();
      }
    } else if (niv == 2) {
    } else if (niv == 3) {
    }
  }
  //moyen
  if (sEtatJeu == "moyen") {
    if (niv == 1) {
    } else if (niv == 2) {
    } else if (niv == 3) {
    }
  }
  //difficile
  if (sEtatJeu == "difficile") {
    if (niv == 1) {
    } else if (niv == 2) {
    } else if (niv == 3) {
    }
  }
}

//-----------------------------------ECRANS JEU--------------------------------------

//Ecran titre
function afficherIntro() {
  minuterie++;
  if (minuterie % 15 == 0 && posCurseur < aLargeurs.length) {
    let largeur = aLargeurs[posCurseur];

    largeurTotale -= largeur;
    pointDepart += largeur;
    posCurseur++;
  }
  oFond.image.src = oFond.introSrc;
  oContexte.clearRect(0, 0, nLargeur, nHauteur);
  oContexte.drawImage(oFond.image, 0, 0, oFond.l, oFond.h);
  oContexte.drawImage(oBoutonDebut, 650, 450, 250, 150);

  //----------ANIMATION

  oContexte.fillStyle = "rgb(234, 236, 206)";
  oContexte.fillRect(pointDepart, 125, largeurTotale, 100);
}

//ChoixDiff
function afficherChoixDiff() {
  oContexte.clearRect(0, 0, nLargeur, nHauteur);
  oFond.image.src = oFond.choixDiffSrc;
  oContexte.drawImage(oFond.image, 0, 0, nLargeur, nHauteur);
  oContexte.drawImage(oBoutonAcceuil, 875, 25, 100, 100);
}

//choixFacile
function afficherNiveau() {
  oFond.image.src = oFond.ecranNiveauSrc;
  oContexte.clearRect(0, 0, nLargeur, nHauteur);
  oContexte.drawImage(oFond.image, 0, 0, nLargeur, nHauteur);
  oContexte.drawImage(oBoutonAcceuil, 875, 25, 100, 100);
  //afficher boutons
  oContexte.drawImage(oBoutonAdd, 175, 375, 120, 120);
  oContexte.drawImage(oBoutonSous, 325, 375, 120, 120);
  oContexte.drawImage(oBoutonMult, 475, 375, 120, 120);
  oContexte.drawImage(oBoutonDiv, 620, 375, 120, 120);
  oContexte.drawImage(oBoutonEgal, 800, 375, 120, 240);
}

function afficherReussi() {
  alert("bravo");
}

function afficherErreur() {
  alert("erreur");
}
//Ecran Fin
function afficherFin() {}

window.addEventListener("load", init);
