"use strict";


const $ = id => document.getElementById(id);


const chars = {
  herika: {
    name: "Dra. Hérika Mori",
    role: "Cientista / especialista em antídotos",
    icon: "🧪", floor: 3, hp: 82, sanity: 82, energy: 75, ammo: 0, infect: 0,
    desc: "Inteligente e determinada. Única capaz de preparar o antídoto. Precisa proteger a filha e manter a sanidade.",
    skill: "Pesquisa científica: prepara a cura e analisa amostras com maior eficiência.",
    goal: "Encontrar a fórmula e os reagentes, preparar o antídoto e escapar.",
    objectives: ["Recuperar a fórmula do antídoto", "Encontrar reagentes médicos", "Preparar o antídoto (antes de 3h)", "Alcançar uma saída de emergência"],
    secret: "A pesquisa da filha de Hérika contém dados que a Umbrella tentou apagar."
  },
  jade: {
    name: "Jade Mendoza",
    role: "Investigadora do governo",
    icon: "🔎", floor: 1, hp: 92, sanity: 85, energy: 85, ammo: 2, infect: 0,
    desc: "Ágil, treinada e desconfiada. Investiga o silêncio da instalação com um mapa incompleto.",
    skill: "Agilidade: menor custo de energia ao fugir e explorar.",
    goal: "Recuperar evidências, entender o silêncio da Umbrella e sobreviver.",
    objectives: ["Investigar a perda de comunicação", "Recuperar 2 evidências", "Encontrar uma rota segura", "Alcançar uma saída de emergência"],
    secret: "Os registros encontrados podem estar conectados a um passado que Jade ainda desconhece."
  },
  will: {
    name: "Will",
    role: "Técnico de TI / infraestrutura",
    icon: "💻", floor: 5, hp: 76, sanity: 78, energy: 80, ammo: 0, infect: 24,
    desc: "Conhece servidores, câmeras e controles de acesso. Já foi infectado e precisa encontrar Hérika.",
    skill: "Especialista digital: restaura sistemas e desbloqueia portas com menos risco.",
    goal: "Restaurar os sistemas, recuperar registros e encontrar Hérika para obter a cura.",
    objectives: ["Restaurar os computadores", "Restaurar a segurança", "Restaurar a comunicação", "Encontrar Hérika ou preparar a cura", "Alcançar uma saída de emergência"],
    secret: "Os logs de manutenção indicam uma alteração suspeita antes do alerta de contenção."
  },
  damon: {
    name: "Damon Salvatore",
    role: "Agente de segurança",
    icon: "🛡️", floor: 2, hp: 100, sanity: 88, energy: 90, ammo: 5, infect: 0,
    desc: "Conhece os protocolos internos e sabe lutar. Procura Hérika sem revelar sua identidade.",
    skill: "Combate tático: maior chance de derrotar infectados e economiza munição.",
    goal: "Encontrar pistas de Hérika, proteger sobreviventes e escapar.",
    objectives: ["Encontrar pistas sobre Hérika", "Acessar o setor de pesquisa", "Unir forças com um sobrevivente", "Alcançar uma saída de emergência"],
    secret: "Um vínculo pessoal com Hérika pode mudar o que Damon está disposto a sacrificar."
  }
};


const rooms = [
  {id:"lobby",name:"Recepção",floor:1,icon:"🚪",desc:"A recepção está vazia. Um telefone toca sem parar atrás do balcão.",items:["bandage","card"],threat:1,clue:"Registro de entrada: a equipe do governo entrou às 02:13."},
  {id:"corridor1",name:"Corredor Leste",floor:1,icon:"🩸",desc:"Luzes vermelhas piscam. Há marcas arrastadas no chão.",items:["apple","energy"],threat:2,clue:"Um aviso confirma que o elevador foi bloqueado remotamente."},
  {id:"security",name:"Sala de Segurança",floor:2,icon:"📹",desc:"Monitores rachados exibem corredores sem sinal.",items:["ammo","card"],threat:1,system:"security",clue:"Uma câmera registrou uma cientista seguindo para o terceiro andar."},
  {id:"archives",name:"Arquivos Internos",floor:2,icon:"📁",desc:"Armários tombados e documentos espalhados por todo o chão.",items:["evidence","coffee"],threat:1,system:"computer",clue:"Relatório confidencial: contenção alterada manualmente 11 minutos antes do surto."},
  {id:"server",name:"Centro de Servidores",floor:2,icon:"💻",desc:"Ventoinhas rugem no escuro. Um terminal continua ligado.",items:["energy","evidence"],threat:2,system:"computer",clue:"Log de sistema: o protocolo de isolamento recebeu uma ordem não autenticada."},
  {id:"office",name:"Escritório de Hérika",floor:3,icon:"🧪",desc:"Anotações científicas cobrem a mesa. A cadeira está virada para a porta.",items:["formula","bandage"],threat:1,clue:"Hérika deixou uma nota: 'A fórmula não está completa. Preciso de reagentes e tempo.'"},
  {id:"lab",name:"Laboratório de Pesquisa",floor:3,icon:"⚗️",desc:"Frascos quebrados refletem a luz fria. O sistema de ventilação falha.",items:["reagent","evidence"],threat:2,clue:"A amostra reage de modo diferente quando exposta ao sangue compatível."},
  {id:"medstore",name:"Armazenamento Médico",floor:4,icon:"🩺",desc:"Prateleiras derrubadas. Um armário de emergência está parcialmente aberto.",items:["reagent","bandage","coffee"],threat:1,clue:"Ficha de estoque: reagentes foram transferidos para a área restrita."},
  {id:"morgue",name:"Necrotério",floor:4,icon:"🥶",desc:"O frio corta a pele. Uma luz pisca sobre uma gaveta aberta.",items:["blood","medkit"],threat:3,clue:"Etiqueta de amostra: O+ — preservar a qualquer custo."},
  {id:"testroom",name:"Sala de Testes",floor:5,icon:"🐀",desc:"Equipamentos de contenção foram arrancados. Há riscos no vidro.",items:["evidence","key"],threat:3,clue:"Arquivo de incidente: o animal de teste foi movido antes do início do turno."},
  {id:"animal",name:"Laboratório Animal",floor:5,icon:"☣️",desc:"Gaiolas abertas e alarmes de contenção em curto-circuito.",items:["reagent","ammo"],threat:3,clue:"Registro apagado: o incidente pode não ter sido acidental."},
  {id:"comms",name:"Central de Comunicação",floor:2,icon:"📡",desc:"O rádio transmite fragmentos de uma mensagem de evacuação.",items:["evidence","coffee"],threat:2,system:"comms",clue:"Mensagem parcial: '...não enviem reforços. Protocolo RG-001...'"},
  {id:"power",name:"Controle de Energia",floor:5,icon:"⚡",desc:"Um painel solta faíscas. O gerador reserva está instável.",items:["energy","key"],threat:2,system:"power",clue:"O gerador foi desligado por um comando originado no setor restrito."},
  {id:"exit",name:"Saída de Emergência",floor:1,icon:"🚨",desc:"A porta externa está selada por um painel de contenção.",items:["apple"],threat:2,exit:true,clue:"O painel exige uma chave de segurança ou a restauração do sistema."},
  {id:"restricted",name:"Pesquisa Restrita",floor:4,icon:"🔒",desc:"Porta reforçada. Do outro lado, uma luz verde continua acesa.",items:["formula2","evidence"],threat:3,locked:true,clue:"Documento classificado: uma segunda fórmula foi mantida fora do inventário oficial."}
];


const links = {
  lobby:["corridor1","exit"],
  corridor1:["lobby","security","office"],
  security:["corridor1","archives","server","comms"],
  archives:["security","server"],
  server:["archives","security","lab"],
  office:["corridor1","lab","medstore"],
  lab:["office","server","medstore","restricted"],
  medstore:["office","morgue","lab"],
  morgue:["medstore","restricted"],
  testroom:["animal","power"],
  animal:["testroom","power"],
  comms:["security","power"],
  power:["comms","testroom","exit"],
  exit:["lobby","power"],
  restricted:["lab","morgue"]
};


const itemInfo = {
  apple:{name:"Maçã",icon:"🍎",type:"consumable",desc:"+5 energia",energy:5},
  energy:{name:"Bebida energética",icon:"🥤",type:"consumable",desc:"+15 energia",energy:15},
  bandage:{name:"Bandagem",icon:"🩹",type:"consumable",desc:"+30 energia, +50 sanidade",energy:30,sanity:50},
  coffee:{name:"Café",icon:"☕",type:"consumable",desc:"+12 energia, +5 sanidade",energy:12,sanity:5},
  medkit:{name:"Kit médico",icon:"🧰",type:"consumable",desc:"+35 vida",hp:35},
  ammo:{name:"Munição",icon:"🔫",type:"ammo",desc:"Reforço de munição"},
  card:{name:"Cartão de acesso",icon:"🪪",type:"key",desc:"Pode liberar áreas restritas"},
  key:{name:"Chave de segurança",icon:"🗝️",type:"key",desc:"Abre a saída de emergência"},
  evidence:{name:"Evidência confidencial",icon:"📄",type:"evidence",desc:"Prova contra a instalação"},
  formula:{name:"Fórmula do antídoto",icon:"🧬",type:"quest",desc:"Fórmula base necessária para a cura"},
  formula2:{name:"Fórmula melhorada",icon:"🧪",type:"quest",desc:"Necessária após 20 minutos"},
  reagent:{name:"Reagente médico",icon:"⚗️",type:"quest",desc:"Material científico"},
  blood:{name:"Sangue O+",icon:"🩸",type:"quest",desc:"Necessário após 40 minutos"}
};


let state = null;
let selectedChar = "will";
let toastTimer = null;
let audioCtx = null;


function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}


function renderCharacters() {
  $("characterGrid").innerHTML = Object.entries(chars).map(([id,c]) =>
    `<div class="char-card ${selectedChar===id?"selected":""}" onclick="selectCharacter('${id}')">
      <div class="char-symbol">${c.icon}</div>
      <div class="tag">ANDAR INICIAL ${c.floor} · ${id==="will"?"INFECTADO":id==="herika"?"CIENTISTA":id==="jade"?"INVESTIGADORA":"SEGURANÇA"}</div>
      <h3>${c.name}</h3><p>${c.desc}</p>
      <div style="font-size:12px;color:#b9c6cd">✦ ${c.skill}</div>
    </div>`
  ).join("");
}


function selectCharacter(id) {
  selectedChar = id;
  renderCharacters();
}


function startGame() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  } catch(e) {}


  const c = chars[selectedChar];


  state = {
    char:selectedChar,
    room:rooms.find(r => r.floor===c.floor &&
      (selectedChar==="will" ? r.id==="testroom" :
       selectedChar==="herika" ? r.id==="office" :
       selectedChar==="jade" ? r.id==="lobby" : r.id==="security")).id,
    turn:1, actions:2, time:0,
    hp:c.hp, sanity:c.sanity, energy:c.energy, ammo:c.ammo, infect:c.infect,
    inventory:[], visited:[], found:{},
    systems:{computer:false,security:false,comms:false,power:false},
    evidence:0, formula:false, formula2:false, reagents:0, blood:false,
    cured:false, metAlly:false, clueCount:0, noise:0, gameover:false,
    won:false, log:[], objectiveDone:[], threats:{}, ending:""
  };


  state.visited = [state.room];
  state.threats = {};


  if (selectedChar==="will") {
    addItem("bandage",false);
    addItem("apple",false);
  }
  if (selectedChar==="damon") addItem("card",false);
  if (selectedChar==="herika") addItem("bandage",false);


  log("PROTOCOLO INICIADO. As comunicações externas estão instáveis.","danger");
  log(c.goal,"clue");
  showScreen("gameScreen");
  render();


  if (selectedChar==="will") {
    setTimeout(() => toast("SINTOMAS DETECTADOS: a infecção já está ativa."),250);
  }
}


function currentRoom() {
  return rooms.find(r => r.id===state.room);
}


function log(msg,type="") {
  state.log.unshift({msg,type,time:formatTime(state.time)});
  if (state.log.length>60) state.log.pop();
}


function formatTime(min) {
  return String(Math.floor(min/60)).padStart(2,"0") + ":" + String(min%60).padStart(2,"0");
}


function toast(msg) {
  $("toast").textContent = msg;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"),2600);
}


function addItem(id,announce=true) {
  if (state.inventory.length>=10) {
    if (announce) toast("Inventário cheio! Use ou descarte um item.");
    return false;
  }


  if (id==="ammo") {
    state.ammo += 2;
    if (announce) log("Munição recuperada: +2.","good");
    return true;
  }


  state.inventory.push(id);
  if (announce) log("Item encontrado: "+itemInfo[id].name+".","good");
  return true;
}


function has(id) {
  return state.inventory.includes(id);
}


function consume(id) {
  const i = state.inventory.indexOf(id);
  if (i>=0) state.inventory.splice(i,1);
}


function spendAction(minutes=5) {
  if (state.actions<=0) {
    toast("Sem ações restantes. Encerre o turno.");
    return false;
  }


  state.actions--;
  state.time += minutes;


  if (state.char==="will") {
    state.infect = Math.min(100,state.infect+(state.time>60?3:2));
  }


  if (state.time>=180 && !state.cured && state.char==="will") {
    state.infect = Math.min(100,state.infect+8);
  }


  if (state.time>=180 && !state.cured && state.char==="herika") {
    log("PRAZO DO ANTÍDOTO EXPIRADO. A única opção é fugir.","danger");
  }


  if (state.infect>=100) {
    endGame(false,"A infecção tomou conta do organismo antes que a missão fosse concluída.");
    return false;
  }


  if (state.hp<=0 || state.sanity<=0) {
    endGame(false,"O personagem não conseguiu resistir às condições extremas da instalação.");
    return false;
  }


  return true;
}


function endTurn() {
  if (!state || state.gameover) return;


  state.time += 3;
  if (state.char==="will") state.infect = Math.min(100,state.infect+2);
  state.turn++;
  state.actions = 2;
  state.noise = Math.max(0,state.noise-1);


  if (Math.random()<.24) {
    state.sanity = Math.max(0,state.sanity-2);
    log("Um ruído distante ecoa pelo duto de ventilação.","danger");
  }


  if (state.hp<=0 || state.sanity<=0 || state.infect>=100) {
    endGame(false,"As condições físicas e psicológicas ultrapassaram o limite de sobrevivência.");
    return;
  }


  log("Novo turno. Duas ações disponíveis.");
  render();
}


function useRest() {
  if (!state || state.gameover) return;
  if (!spendAction(5)) return;


  state.energy = Math.min(100,state.energy+10);
  state.sanity = Math.min(100,state.sanity+4);
  log("Você para por um instante para recuperar o fôlego. +10 energia, +4 sanidade.","good");
  render();
}


function moveTo(id) {
  if (state.gameover || state.actions<=0) return toast("Sem ações restantes.");
  if (!links[state.room].includes(id)) {
    return toast("Esse setor não está conectado diretamente. Explore uma rota adjacente.");
  }


  const room = rooms.find(r => r.id===id);


  if (room.locked && !has("card") && !state.systems.security && !has("key")) {
    return showChoice("Acesso restrito","A porta exige cartão, chave ou o sistema de segurança restaurado.",[
      {label:"Procurar outro caminho",fn:closeModal},
      {label:"Usar uma ação para forçar",fn:()=>{
        closeModal();
        if (!spendAction(8)) return;
        state.energy = Math.max(0,state.energy-18);
        state.noise += 2;
        room.locked = false;
        state.visited.push(id);
        state.room = id;
        log("Você força a porta. O estrondo ecoa pelo andar.","danger");
        encounter(room);
        render();
      }}
    ]);
  }


  if (room.floor!==currentRoom().floor && !state.systems.power && Math.random()<.4) {
    toast("Elevador sem energia. Procure o controle de energia ou uma rota alternativa.");
    return;
  }


  if (!spendAction(5)) return;


  state.energy = Math.max(0,state.energy-(state.char==="jade"?3:5));
  state.room = id;
  if (!state.visited.includes(id)) state.visited.push(id);


  log("Deslocamento: "+room.name+".","");
  if (state.energy<=10) log("Energia baixa: ações físicas estão ficando arriscadas.","danger");
  if (room.id==="exit") log("Você chegou à saída, mas o painel ainda precisa ser liberado.","clue");


  if (room.clue && !state.found[id]) {
    state.found[id] = true;
    state.clueCount++;
    log("PISTA: "+room.clue,"clue");
  }


  if (room.id==="office" && state.char==="will") {
    state.metAlly = true;
    log("Você reconhece anotações de Hérika. A esperança de encontrar a doutora aumenta.","good");
  }


  if (room.id==="lab" && state.char==="damon") {
    state.metAlly = true;
    log("Você encontrou sinais recentes de que Hérika passou por aqui.","clue");
  }


  encounter(room);
  render();
}


function encounter(room) {
  if (state.gameover) return;


  let threat = room.threat || 0;
  if (state.systems.security) threat = Math.max(0,threat-1);


  if (threat>0 && !state.threats[room.id] &&
      Math.random()<Math.min(.78,threat*.19+state.noise*.08)) {
    state.threats[room.id] = true;
    state.hp = Math.max(0,state.hp-(state.char==="damon"?7:state.char==="jade"?10:16));
    state.sanity = Math.max(0,state.sanity-4);


    if (state.char==="will") state.infect = Math.min(100,state.infect+8);


    log("INFECTADO ENCONTRADO! Você sofre dano durante a fuga. Vida reduzida.","danger");
    beep(130,.18);


    if (state.hp<=0 || state.sanity<=0 || state.infect>=100) {
      endGame(false,"Um infectado alcançou você em um corredor sem rota de fuga.");
      return;
    }
  }
}


function explore() {
  if (!spendAction(7)) return;


  const room = currentRoom();
  state.energy = Math.max(0,state.energy-5);


  if (!state.found[room.id] && room.clue) {
    state.found[room.id] = true;
    state.clueCount++;
    log("PISTA: "+room.clue,"clue");
  }


  const pool = (room.items||[]).filter(id => !state.found[room.id+"_"+id]);


  if (pool.length && Math.random()<.82) {
    const id = pool[Math.floor(Math.random()*pool.length)];
    state.found[room.id+"_"+id] = true;
    if (addItem(id)) log("Busca concluída no setor "+room.name+".","good");
  } else {
    state.noise++;
    if (Math.random()<.45) {
      state.hp = Math.max(0,state.hp-6);
      log("Você encontra apenas destroços — e algo se move no escuro. -6 vida.","danger");
    } else {
      log("Nada útil encontrado. A busca fez barulho.","");
    }
  }


  render();
  checkLoss();
}


function repairSystem() {
  const room = currentRoom();
  if (!room.system) return toast("Não há terminal de sistema funcional neste setor.");


  const sys = room.system;
  if (state.systems[sys]) return toast("Este sistema já foi restaurado.");
  if (state.energy<8) return toast("Energia insuficiente para trabalhar no terminal.");
  if (!spendAction(state.char==="will"?8:12)) return;


  state.energy -= 8;


  const chance = state.char==="will" ? .9 : state.char==="damon" ? .65 : .48;


  if (Math.random()<chance) {
    state.systems[sys] = true;
    log("SISTEMA RESTAURADO: "+({
      computer:"computadores e registros",
      security:"segurança e câmeras",
      comms:"comunicação externa",
      power:"controle de energia"
    })[sys]+".","good");


    beep(700,.1);


    if (sys==="computer") {
      state.evidence++;
      log("Um arquivo recuperado foi adicionado às evidências.","clue");
    }


    if (sys==="security") {
      log("As câmeras mostram rotas alternativas e reduzem o risco de encontros.","good");
    }


    if (sys==="comms") {
      log("Uma mensagem parcial foi enviada para o exterior. Há sobreviventes lá fora.","clue");
    }


    if (sys==="power") {
      log("Energia restaurada: elevadores e algumas portas voltam a responder.","good");
    }
  } else {
    state.sanity = Math.max(0,state.sanity-5);
    state.noise++;
    log("Falha no reparo. Um alerta foi disparado e o terminal bloqueou o acesso.","danger");
  }


  render();
  checkLoss();
}


function fight() {
  if (!spendAction(5)) return;


  const room = currentRoom();
  const hasThreat = room.threat>0 && !state.threats[room.id];


  if (!hasThreat) {
    log("Nenhum infectado visível. Você avança com cautela.");
    render();
    return;
  }


  if (state.char!=="damon" && state.ammo<=0) {
    state.energy = Math.max(0,state.energy-15);
    state.hp = Math.max(0,state.hp-8);
    state.noise += 2;
    log("Sem munição, você tenta escapar do infectado e se machuca.","danger");
  } else {
    const cost = state.char==="damon" ? 1 : 2;


    if (state.ammo>=cost) {
      state.ammo -= cost;
      state.threats[room.id] = true;
      log("Você neutraliza a ameaça. Munição restante: "+state.ammo+".","good");
      beep(240,.12);
    } else {
      state.hp = Math.max(0,state.hp-18);
      state.energy = Math.max(0,state.energy-12);
      log("O confronto sai errado. Você é ferido e precisa recuar.","danger");
    }
  }


  render();
  checkLoss();
}


function useItem(id) {
  if (!has(id)) return;


  const item = itemInfo[id];
  if (item.type!=="consumable") return toast("Este item não pode ser consumido agora.");


  consume(id);
  if (item.energy) state.energy = Math.min(100,state.energy+item.energy);
  if (item.sanity) state.sanity = Math.min(100,state.sanity+item.sanity);
  if (item.hp) state.hp = Math.min(100,state.hp+item.hp);


  log(item.name+" utilizado. "+item.desc+".","good");
  render();
}


function discardItem(id) {
  if (!has(id)) return;
  consume(id);
  log("Item descartado: "+itemInfo[id].name+".");
  render();
}


function prepareAntidote() {
  if (state.char!=="herika") return toast("Apenas Hérika consegue preparar o antídoto.");
  if (state.time>=180) return toast("Prazo expirado: não é mais possível preparar o antídoto.");
  if (!has("formula") && !state.formula) return toast("Falta a fórmula base.");


  const needImproved = state.time>=20;
  const needBlood = state.time>=40;


  if (needImproved && !has("formula2") && !state.formula2) {
    return toast("Após 20 minutos, você precisa da fórmula melhorada.");
  }
  if (state.reagents<1 && !has("reagent")) return toast("Falta pelo menos um reagente médico.");
  if (needBlood && !has("blood") && !state.blood) return toast("Após 40 minutos, é necessário sangue O+.");
  if (state.sanity<25) return toast("Sanidade abaixo de 25%: Hérika não consegue concluir o procedimento.");
  if (!spendAction(10)) return;


  if (has("formula")) consume("formula");
  if (has("formula2")) consume("formula2");
  if (has("reagent")) consume("reagent");
  if (has("blood")) consume("blood");


  state.cured = true;
  state.infect = 0;
  log("ANTÍDOTO PREPARADO. A infecção foi neutralizada — por enquanto.","good");


  showChoice("Antídoto estabilizado","A fórmula funcionou. O lockdown continua ativo e a saída precisa ser alcançada.",[
    {label:"Continuar para a saída",fn:closeModal}
  ]);


  render();
}


function useTerminalAction() {
  const room = currentRoom();


  if (room.system) {
    repairSystem();
    return;
  }


  if (state.char==="will") {
    return showChoice("Acesso técnico","Você pode tentar recuperar os logs locais, mesmo sem um terminal principal.",[
      {label:"Recuperar logs (+evidência)",fn:()=>{
        closeModal();
        if (!spendAction(7)) return;
        state.evidence++;
        state.clueCount++;
        state.sanity = Math.max(0,state.sanity-2);
        log("Logs recuperados: alteração de configuração encontrada antes do surto.","clue");
        render();
      }},
      {label:"Cancelar",fn:closeModal}
    ]);
  }


  toast("Nenhum terminal utilizável neste setor.");
}


function unlockExit() {
  if (state.room!=="exit") return toast("Você precisa estar na saída de emergência.");


  if (state.time>=180 && !state.cured && state.char==="herika") {
    log("A cura não está mais disponível. Prioridade: escapar.","danger");
  }


  if (!has("key") && !state.systems.security && !state.systems.power) {
    return toast("Saída selada: procure uma chave ou restaure segurança/energia.");
  }


  if (!spendAction(5)) return;
  if (has("key")) consume("key");


  log("PAINEL DA SAÍDA LIBERADO. A porta externa está abrindo.","good");


  const cureBonus = state.cured ? 1 : 0;
  const ev = state.evidence + state.inventory.filter(x => x==="evidence").length;


  endGame(
    true,
    state.cured
      ? "Você escapou com o antídoto e uma chance de salvar vidas."
      : "Você escapou da instalação, mas a infecção e os segredos da RG-001 continuam sem resposta.",
    {cureBonus,ev}
  );
}


function meetChoice() {
  if (state.char!=="herika" && state.char!=="will" && state.char!=="damon") {
    return toast("Ainda não há contato confirmado com Hérika.");
  }


  showChoice("Sinal de sobrevivente","Uma voz falha surge no rádio: “Se alguém estiver ouvindo, encontrem o laboratório de pesquisa...”",[
    {label:"Responder e compartilhar pistas",fn:()=>{
      closeModal();
      state.metAlly = true;
      state.sanity = Math.min(100,state.sanity+5);
      log("Contato estabelecido. Uma voz confirma que Hérika pode estar no terceiro andar.","clue");
      render();
    }},
    {label:"Manter silêncio",fn:()=>{
      closeModal();
      state.sanity = Math.max(0,state.sanity-2);
      log("Você mantém o rádio desligado. Não sabe quem pode estar escutando.","danger");
      render();
    }}
  ]);
}


function showChoice(title,text,opts) {
  $("modalKicker").textContent = "DECISÃO DE CAMPO";
  $("modalTitle").textContent = title;
  $("modalText").textContent = text;
  $("modalExtra").innerHTML = "";


  $("modalActions").innerHTML = opts.map((o,i) =>
    `<button class="${i===0?"primary":""}" onclick="choiceAction(${i})">${o.label}</button>`
  ).join("");


  window._choice = opts;
  $("modalOverlay").classList.add("show");
}


function choiceAction(i) {
  const o = window._choice?.[i];
  if (o) o.fn();
}


function closeModal() {
  $("modalOverlay").classList.remove("show");
}


function showRulesModal() {
  showChoice(
    "Regras rápidas",
    "Duas ações por turno. Tempo, energia, sanidade e recursos são limitados. Will acumula infecção; Hérika prepara o antídoto; sistemas restaurados facilitam a fuga.",
    [{label:"Entendi",fn:closeModal}]
  );
}


function confirmRestart() {
  showChoice("Reiniciar protocolo?","O progresso desta partida será perdido.",[
    {label:"Continuar jogando",fn:closeModal},
    {label:"Reiniciar partida",fn:()=>{closeModal();startGame();}}
  ]);
}


function checkLoss() {
  if (state.hp<=0 || state.sanity<=0 || state.infect>=100) {
    endGame(false,"Você foi alcançado antes de completar a missão.");
  }
}


function endGame(won,reason,extra={}) {
  if (!state || state.gameover) return;


  state.gameover = true;
  state.won = won;
  state.ending = reason;
  document.body.classList.remove("alarm","infected","critical");


  $("endIcon").textContent = won ? "🚪" : "☣";
  $("endKicker").textContent = won ? "RELATÓRIO DE EVACUAÇÃO" : "RELATÓRIO DE FALHA";
  $("endTitle").textContent = won ? "VOCÊ SOBREVIVEU" : "VOCÊ FOI ALCANÇADO";
  $("endText").textContent = reason;


  const ev = state.evidence + state.inventory.filter(x=>x==="evidence").length;


  $("endReport").innerHTML =
    `<b>PERSONAGEM:</b> ${chars[state.char].name}<br>
     <b>TEMPO DECORRIDO:</b> ${formatTime(state.time)} / limite de 03:00<br>
     <b>TURNO:</b> ${state.turn}<br>
     <b>VIDA:</b> ${state.hp}% · <b>SANIDADE:</b> ${state.sanity}% · <b>ENERGIA:</b> ${state.energy}%<br>
     <b>INFECÇÃO:</b> ${state.infect}%<br>
     <b>EVIDÊNCIAS:</b> ${ev}<br>
     <b>SISTEMAS RESTAURADOS:</b> ${Object.values(state.systems).filter(Boolean).length}/4<br>
     <b>ANTÍDOTO:</b> ${state.cured?"PREPARADO":"NÃO PREPARADO"}<br>
     <b>RESULTADO:</b> ${won?(state.cured?"Fuga com cura":"Fuga sem cura"):"Missão fracassada"}`;


  log(won?"EVACUAÇÃO CONCLUÍDA.":"MISSÃO FRACASSADA.",won?"good":"danger");
  showScreen("endScreen");
  beep(won?600:90,.35);
}


function saveGame() {
  if (!state) return;


  try {
    localStorage.setItem("rg001_save",JSON.stringify(state));
    toast("Partida guardada neste navegador.");
  } catch(e) {
    toast("Não foi possível guardar neste navegador.");
  }
}


function loadGame() {
  try {
    const raw = localStorage.getItem("rg001_save");
    if (raw) {
      state = JSON.parse(raw);
      showScreen("gameScreen");
      render();
      toast("Partida carregada.");
    }
  } catch(e) {
    toast("Falha ao carregar a partida.");
  }
}


function beep(freq=300,duration=.1) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();


    osc.type = "sawtooth";
    osc.frequency.value = freq;
    gain.gain.value = .035;


    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);
    osc.stop(audioCtx.currentTime+duration);
  } catch(e) {}
}


function render() {
  if (!state) return;


  const c = chars[state.char];
  const room = currentRoom();


  $("missionTitle").textContent = c.icon+" "+c.name+" — "+room.name;
  $("headerTime").textContent = formatTime(state.time);
  $("headerTurn").textContent = state.turn;
  $("headerStatus").textContent =
    state.gameover ? "ENCERRADO" :
    state.infect>=65 ? "RISCO CRÍTICO" : "CONTENÇÃO FALHOU";


  $("actionsLeft").textContent = state.actions;
  $("floorLabel").textContent = "ANDAR "+room.floor+" / 5";


  const stats = [
    ["Vida",state.hp,"red"],
    ["Sanidade",state.sanity,"purple"],
    ["Energia",state.energy,"gold"],
    ["Infecção",state.infect,"red"]
  ];


  $("stats").innerHTML = stats.map(([n,v,col]) =>
    `<div class="stat"><span>${n}</span><strong>${v}%</strong>
      <div class="meter ${col}"><i style="width:${v}%"></i></div>
    </div>`
  ).join("");


  document.body.classList.toggle("alarm",state.infect>=65 || state.hp<=30);
  document.body.classList.toggle("infected",state.char==="will" && state.infect>=30);
  document.body.classList.toggle("critical",state.char==="will" && state.infect>=75);


  $("mapGrid").innerHTML = rooms
    .filter(r => state.visited.includes(r.id) || r.floor===room.floor || state.systems.security)
    .map(r =>
      `<button class="room ${r.id===state.room?"current":""} ${state.visited.includes(r.id)?"visited":""} ${r.locked&&!has("card")&&!state.systems.security&&!has("key")?"locked":""}"
        onclick="moveTo('${r.id}')" title="${r.desc}">
        <span class="floor">ANDAR ${r.floor}</span>
        <span class="rname">${r.name}</span>
        <span class="room-icon">${r.icon}</span>
        ${r.id===state.room?'<span class="badge-mini">VOCÊ</span>':""}
      </button>`
    ).join("");


  const actionDefs = [
    ["🔍","Explorar setor","Busca pistas e itens",explore],
    ["🖥️","Usar terminal","Restaurar sistemas / recuperar logs",useTerminalAction],
    ["⚔️","Enfrentar ameaça","Combate consome munição",fight],
    ["🧪","Preparar antídoto","Somente Hérika · exige materiais",prepareAntidote],
    ["📡","Contatar sobreviventes","Tentar localizar aliados",meetChoice],
    ["🚨","Liberar saída","Somente no setor de saída",unlockExit]
  ];


  $("actionsGrid").innerHTML = actionDefs.map(([ico,name,desc,fn],i) =>
    `<button class="action-btn" onclick="runAction(${i})" ${state.actions<=0?"disabled":""}>
      <span class="ico">${ico}</span><span><b>${name}</b><small>${desc}</small></span>
    </button>`
  ).join("");


  $("inventoryCount").textContent = state.inventory.length;


  $("inventory").innerHTML = Array.from({length:10},(_,i) => {
    const id = state.inventory[i];
    return `<div class="slot ${id?"filled":""}">${
      id ? `<span><span class="item-icon">${itemInfo[id].icon}</span>${itemInfo[id].name}</span>` : "Vazio"
    }</div>`;
  }).join("");


  $("itemControls").innerHTML = state.inventory.map(id =>
    itemInfo[id].type==="consumable"
      ? `<button class="small green" onclick="useItem('${id}')">Usar ${itemInfo[id].icon}</button>`
      : `<button class="small" onclick="discardItem('${id}')">Descartar ${itemInfo[id].icon}</button>`
  ).join("");


  const obj = makeObjectives();
  $("objectiveCount").textContent = obj.filter(o=>o.done).length+"/"+obj.length;
  $("objectives").innerHTML = obj.map(o =>
    `<div class="objective ${o.done?"done":""}">${o.text}</div>`
  ).join("");


  $("log").innerHTML = state.log.map(l =>
    `<div class="log-entry ${l.type}"><span style="color:#74848e">[${l.time}]</span> ${l.msg}</div>`
  ).join("");


  const inf = state.infect;
  const stage = inf>=75 ? "CRÍTICO" : inf>=35 ? "INTERMEDIÁRIO" : "INICIAL";


  $("diagnostic").innerHTML =
    `<div class="storybox"><b>${c.icon} ${c.name}</b><br>${c.goal}</div>
     <div style="font-size:12px;color:var(--muted);margin-bottom:6px">
       ESTÁGIO DE INFECÇÃO:
       <b style="color:${inf>=75?"var(--red2)":inf>=35?"var(--gold)":"var(--green)"}">
         ${state.char==="will"?stage:"NÃO DETECTADA"}
       </b>
     </div>
     <div class="meter red"><i style="width:${inf}%"></i></div>
     <p style="font-size:12px;color:var(--muted)">
       ${state.char==="will"
         ? inf>=75
           ? "Visão severamente comprometida. Tremores e falhas visuais frequentes."
           : inf>=35
             ? "Visão ocasionalmente embaçada; tremores começam a atrapalhar."
             : "Sintomas leves, mas a infecção está progredindo."
         : "Atenção a ferimentos, sanidade e energia. O tempo não para."}
     </p>
     <div style="border-top:1px solid var(--line);padding-top:10px;font-size:12px;color:#a9b7bf">
       SISTEMAS: ${Object.entries(state.systems).map(([k,v]) =>
         `${({computer:"PC",security:"SEG",comms:"COM",power:"ENE"})[k]} ${v?"🟢":"🔴"}`
       ).join(" · ")}
       <br>PISTAS ENCONTRADAS: ${state.clueCount}
     </div>`;
}


function runAction(i) {
  if (!state || state.gameover) return;
  if (i===0) explore();
  if (i===1) useTerminalAction();
  if (i===2) fight();
  if (i===3) prepareAntidote();
  if (i===4) meetChoice();
  if (i===5) unlockExit();
}


function makeObjectives() {
  const c = state.char;
  const hasEvidence = state.evidence + state.inventory.filter(x=>x==="evidence").length;


  if (c==="will") return [
    {text:"Restaurar computadores",done:state.systems.computer},
    {text:"Restaurar segurança e câmeras",done:state.systems.security},
    {text:"Restaurar comunicação",done:state.systems.comms},
    {text:"Encontrar Hérika / recuperar registros",done:state.metAlly||state.evidence>=2},
    {text:"Alcançar a saída de emergência",done:state.won}
  ];


  if (c==="herika") return [
    {text:"Recuperar a fórmula base",done:state.formula||has("formula")},
    {text:"Encontrar reagentes médicos",done:state.reagents>0||has("reagent")},
    {text:"Preparar o antídoto antes do limite",done:state.cured},
    {text:"Manter sanidade acima de 25%",done:state.sanity>=25},
    {text:"Alcançar a saída de emergência",done:state.won}
  ];


  if (c==="jade") return [
    {text:"Investigar a perda de comunicação",done:state.systems.comms||state.clueCount>=2},
    {text:"Recuperar 2 evidências",done:hasEvidence>=2},
    {text:"Encontrar uma rota segura",done:state.systems.security||state.systems.power||has("key")},
    {text:"Alcançar a saída de emergência",done:state.won}
  ];


  return [
    {text:"Encontrar pistas sobre Hérika",done:state.metAlly||state.clueCount>=2},
    {text:"Acessar setor de pesquisa",done:state.visited.includes("office")||state.visited.includes("lab")},
    {text:"Unir forças com um sobrevivente",done:state.metAlly},
    {text:"Alcançar a saída de emergência",done:state.won}
  ];
}


function syncQuestItems() {
  if (!state) return;
  state.formula = state.formula || has("formula");
  state.formula2 = state.formula2 || has("formula2");
  state.blood = state.blood || has("blood");
  state.reagents = state.reagents + (state._reagentCounted ? 0 : 0);
}


// Contabiliza itens de missão encontrados.
const _addItem = addItem;


addItem = function(id,announce=true) {
  const result = _addItem(id,announce);


  if (result && state) {
    if (id==="formula") state.formula = true;
    if (id==="formula2") state.formula2 = true;
    if (id==="blood") state.blood = true;
    if (id==="reagent") state.reagents++;
    if (id==="evidence") state.evidence++;
  }


  return result;
};


const _moveTo = moveTo;


function formatInit() {
  renderCharacters();
}


formatInit();
