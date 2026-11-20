/** Every UI string lives here so a translation can be added later. English only for now. */
import type { Period } from "@/lib/game";

const listJoin = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

export const S = {
  appName: "Categhero",
  tagline: "Be the best in one category.",
  home: "Home",
  loading: "Loading…",

  auth: {
    title: "Who's the best in a category?",
    lead: "Pick a name to enter the rankings. Every category has a leader, and anyone can take their spot.",
    nameLabel: "Name",
    namePlaceholder: "What should we call you?",
    nameTooShort: "Type a name with at least 2 characters.",
    nameTooLong: "Keep your name to 24 characters or fewer.",
    submit: "Start playing",
    switchPlayer: "Switch player",
    testNote: "Test build. Names and rankings are saved in this browser only.",
  },

  homeScreen: {
    greeting: (name: string) => `Hi, ${name}`,
    lead: "Pick a category and climb to the top of its ranking.",
    play: "Play",
    comingSoon: "Coming soon",
    soon: ["European capitals", "Make your own category"],
  },

  category: {
    eyebrow: "Category",
    back: "Categories",
    challenge: "Challenge",
    practice: "Practice",
    leader: "Leader",
    leaderLine: (score: number, total: number, time: string) => `with ${score}/${total} in ${time}`,
    noLeader: "No leader yet. Play a Challenge to take the crown.",
    rules: (items: number, units: string, unit: string) => [
      { icon: "3", strong: "3 lives.", text: `Each wrong answer or timeout costs one. The run ends when your lives run out or all ${items} ${units} are done.` },
      { icon: "10", strong: `10 seconds per ${unit}`, text: "in Challenge. Practice has no clock, no lives and stays off the ranking." },
      { icon: "=", strong: "", text: "The ranking counts correct answers. On a tie, the faster total time wins." },
    ],
    ranking: "Ranking",
  },

  periods: { total: "Total", month: "Monthly", week: "Weekly" } satisfies Record<Period, string>,
  periodNote: {
    total: "Each player's best run of all time.",
    month: "Each player's best run in the last 30 days.",
    week: "Each player's best run in the last 7 days.",
  } satisfies Record<Period, string>,
  rank: {
    you: "you",
    empty: "Nobody has played in this period yet.",
    notYou: "Play a Challenge to get your spot here.",
  },

  game: {
    exit: "Exit run",
    lives: (n: number) => `Lives: ${n}`,
    practiceTag: "Practice",
    progress: (i: number, n: number) => `${i} of ${n}`,
    correct: "Correct!",
    wrong: "Wrong",
    timeout: "Time's up",
    itWas: (answer: string) => `It was ${answer}.`,
    continue: "Continue",
    seeResults: "See results",
    quitTitle: "Leave this run?",
    quitChallenge: "This run won't count for the ranking.",
    quitPractice: "Your practice ends here.",
    keepPlaying: "Keep playing",
    leave: "Leave",
    mapLabel: "Map of Europe with one country highlighted",
    zoomLabel: (name: string) => `Close-up map of ${name}`,
  },

  results: {
    practiceDone: "Practice complete",
    allDone: "All done",
    gameOver: "Game over",
    practiceSub: "Practice runs stay off the ranking.",
    livesLeft: (n: number) => `You finished with ${n} ${n === 1 ? "life" : "lives"} left.`,
    noLives: (n: number) => `You used all ${n} lives.`,
    totalTime: (t: string) => `Total time: ${t}.`,
    yourPosition: "Your position",
    positionOf: (pos: number, of: number) => `#${pos} of ${of}`,
    tookLead: (name: string, periods: string[]) => `You took the lead from ${name} in ${listJoin(periods)}.`,
    keptLead: (period: string) => `You're still #1 in ${period}.`,
    review: "Review",
    playAgain: "Play again",
    practiceAgain: "Practice again",
    viewRanking: "View ranking",
  },

  errors: {
    notFound: "This category doesn't exist.",
    backHome: "Back to categories",
  },
};
