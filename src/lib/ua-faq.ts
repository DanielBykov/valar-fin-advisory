/**
 * The doubts a Ukrainian newcomer holds before they will write to anyone, and
 * the answers to them.
 *
 * Deliberately NOT a lead magnet. These are objections, and an objection has to
 * be answered before the person acts, not gated behind the email address that
 * acting means giving up — asking for the commitment first is the wrong way
 * round. On the page, in the open, where a doubt can be read and dropped.
 *
 * ⚠️ Every answer is Lena's, dictated 2026-09-03, and needs her sign-off before
 * this page is published. Four of them state something outside her own process
 * and are flagged inline: residency, the two-year self-employed history, the
 * clawback, and the free financial plan. Those are the ones that go stale, vary
 * by lender, or have to agree with the Disclosure Statement.
 *
 * Shared by the page (which renders them) and its metadata (which turns them
 * into FAQ structured data), so the two can never drift.
 */

/**
 * `answer` is paragraphs. Most questions need one or two; the first needs three.
 *
 * `group` is what keeps fourteen questions from reading as a wall. Grouped, the
 * page offers four topics rather than a list nobody scans to the end of — and
 * a reader looking for their own worry finds it without reading the other
 * thirteen. Two columns would have been the other fix and is worse: expanding
 * an item in the left column shoves the right column down, and the reading
 * order stops being obvious.
 */
export type UaFaqGroup =
  /*
   * Named for the adviser, not for Lena: "про роботу зі мною" and "чи можу я
   * взагалі" put two different people behind the same pronoun one after the
   * other, and a reader has to stop and work out whose "я" it is. The first
   * label now names the role and the second has no pronoun at all.
   */
  | "Про роботу з адвайзером"
  | "Чи варто спробувати?"
  | "Як це працює"
  | "Інвестиції";

export type UaFaqItem = { group: UaFaqGroup; question: string; answer: string[] };

/** Render order of the groups. */
export const UA_FAQ_GROUPS: UaFaqGroup[] = [
  "Про роботу з адвайзером",
  "Чи варто спробувати?",
  "Як це працює",
  "Інвестиції",
];

export const UA_FAQ: UaFaqItem[] = [
  /*
   * The longest answer on the page, and the only one that opens by conceding
   * the point. "Можна, і це правда" is what makes the rest readable: a page
   * that answers "do I even need you?" with a straight no has told the reader
   * it is selling, and they stop reading before the actual argument.
   *
   * It builds: product range, then whose side you are on, then the one a bank
   * genuinely cannot offer — a mortgage shaped around a life rather than around
   * a purchase. Lena named that as the real answer, and it is last because it
   * is the part worth remembering.
   *
   * Three sentences shorter than the first draft, and the closing line is now
   * "Банк цього не робить." A longer version spelled out what a bank asks
   * instead, in quoted questions; Lena cut it. Three flat words land harder
   * than an explanation of them.
   */
  {
    group: "Про роботу з адвайзером",
    question: "Чи потрібен мені взагалі mortgage adviser? Можна ж піти прямо в банк.",
    answer: [
      "Можна, і це правда. Різниця в тому, що банк запропонує тільки свої продукти, а адвайзер порівнює кількох кредиторів і підбирає структуру під вашу ситуацію. Подати документи адвайзер може і у ваш власний банк, просто правильно склавши ваш кейс.",
      "Адвайзер працює на вашому боці. Ми проговоримо, яка сума кредиту для вас оптимальна і як його краще структурувати. Це не завжди максимум, який готовий дати банк.",
      "І головне: іпотека має відповідати не лише вашій зарплаті сьогодні, а й тому, як ви плануєте жити далі. Діти, зміна роботи, переїзд, друга нерухомість, пенсія. Ми будуємо структуру під ваше життя, а не тільки під цю покупку. Банк цього не робить.",
    ],
  },

  /*
   * The exception has to be here, but the first draft read like a warning and
   * Lena was right that it pushed people away: it opened with the word
   * "clawback", which nobody outside the industry knows, and left the reader
   * expecting a bill straight after being told the service is free.
   *
   * No jargon, framed as rare, and closing on the promise rather than the risk
   * — "несподіваних рахунків не буває" is the sentence that turns a caveat into
   * a reason to trust her.
   *
   * A non-bank lender is NOT listed as a case, on Lena's correction: it does not
   * automatically mean a fee, and naming it would tell someone heading for a
   * non-bank deal to expect an invoice that often never comes. The list is
   * therefore examples ("наприклад"), not an exhaustive set — the Disclosure
   * Statement, linked below, is where the full list lives.
   *
   * ⚠️ CHECK AGAINST THE DISCLOSURE STATEMENT. Its wording is "$250 per hour …
   * and/or to recover or part-recover a commission clawback where a loan is
   * repaid or refinanced early". If that paragraph is edited, this moves with it.
   */
  {
    group: "Про роботу з адвайзером",
    question: "Скільки коштують ваші послуги?",
    answer: [
      "У більшості випадків для вас нічого: за мою роботу платить банк.",
      "Рахунок можливий тільки в рідкісних випадках: наприклад, якщо ви погасите або рефінансуєте кредит дуже скоро після оформлення, або якщо робота виходить далеко за межі звичайної іпотеки.",
      "У кожному такому випадку я назву вам суму заздалегідь, до того як ви приймете пропозицію банку. Несподіваних рахунків не буває. Повні умови у Disclosure Statement.",
    ],
  },

  {
    group: "Про роботу з адвайзером",
    question: "Якою мовою ми спілкуємось?",
    answer: [
      "Тією, якою вам зручно: українською, російською або англійською.",
      "Але всі юридичні документи, листування з банком і подання вашої справи за законодавством мають бути англійською. Я поясню кожен документ і кожне питання, якщо щось незрозуміло.",
    ],
  },

  /*
   * ⚠️ TOUCHES THE OVERSEAS INVESTMENT ACT. Deliberately general: "за загальним
   * правилом" and "окремо стоять апартаменти", with the answer being to ask
   * rather than to read a rule off a landing page. Do not add specifics here
   * without checking the Act — the detail changes and getting it wrong in
   * public is worse than saying less.
   *
   * The lawyer referral is what makes staying general safe: it says out loud
   * that the final answer to an ownership question is not hers to give, which
   * is both true and the reason nothing more specific belongs above it.
   */
  {
    group: "Чи варто спробувати?",
    question: "Я нещодавно в Новій Зеландії. Чи можу я взагалі купити житло?",
    answer: [
      "Дуже залежить від вашого статусу. За загальним правилом купувати житло можуть резиденти; окремо стоять апартаменти та деякі інші форми власності.",
      "Напишіть мені, і ми з'ясуємо це досить швидко. Якщо потрібно, я можу направити ваш запит до юриста.",
    ],
  },

  /*
   * ⚠️ THE MOST CLAIM-DENSE ANSWER ON THE PAGE. Both statements are Lena's:
   * that 5% is possible, and that Kāinga Ora programmes exist for certain
   * first home buyers. Neither is described mechanically here — eligibility
   * for a low-deposit loan has income and price caps that change, and the
   * answer is deliberately "we check on the call" rather than a rule.
   *
   * Lena's dictation said the programme "допомагає зафіксувати ставку на
   * низькому рівні". That is not written here: as far as this file's author
   * knows, the Kāinga Ora First Home Loan is a low-deposit scheme rather than a
   * rate subsidy, and describing a government programme wrongly in public is
   * worse than describing it loosely. If she means something specific, her
   * exact wording replaces the second paragraph.
   */
  {
    group: "Чи варто спробувати?",
    question:
      "У мене маленький депозит і невеликий дохід. Чи варто взагалі пробувати?",
    answer: [
      "Варто. Купити житло можна навіть з депозитом 5%.",
      "Крім того, для певних категорій first home buyer існують програми Kāinga Ora. Чи підходите ви під них, перевіряємо на розмові, і зробити це я раджу якнайшвидше.",
      "А якщо зараз справді не виходить, ми складемо план на наступний рік або два-три: що саме треба змінити, щоб вийшло. Часто це і є найкращий початок.",
    ],
  },

  /*
   * "Два роки" is lender policy, not law: it differs between banks and it
   * changes. Hence "можуть просити" rather than "просять", and no naming of
   * which banks — the first draft said "банки першого рівня" and Lena took it
   * out, which also takes out the claim that the tier behaves as a group.
   */
  {
    group: "Чи варто спробувати?",
    question: "У мене нестандартний або непостійний дохід. Чи є сенс пробувати?",
    answer: [
      "Тут усе залежить від кейсу. Банки можуть просити звітність і дохід за два роки, але і тут існують винятки.",
      "Крім того, купівлю іноді можна профінансувати через інші фінансові установи, якщо чекати два роки ви не хочете. Треба дивитися вашу конкретну ситуацію.",
    ],
  },

  /*
   * ⚠️ The ages are lender policy, not law: they differ by lender and they
   * move. This is Lena's own second pass, and it says more than the first did
   * ("зазвичай дають до 70" rather than "не обов'язково обмежуються 65"), so
   * the hedges are load-bearing: "зазвичай", "в окремих випадках", "залежить
   * від кейсу". Do not firm them up.
   *
   * Opens with the flat answer on its own line. It used to lead with "у мене є
   * клієнти, які купували не в двадцять і не в тридцять"; Lena cut it. Someone
   * asking this is expecting to be told no, and four plain words are a cleaner
   * "no you are not too old" than an anecdote about other people.
   */
  {
    group: "Чи варто спробувати?",
    question: "Я вже в зрілому віці. Чи дасть мені банк кредит, чи я назавжди в оренді?",
    answer: [
      "Купити будинок можна практично в будь-якому віці.",
      "Банки зазвичай дають кредит до 70 років, а в окремих випадках і пізніше: до 80 і навіть більше. Але це дуже залежить від кейсу.",
    ],
  },

  {
    group: "Як це працює",
    question: "Ви подаєте заявки одразу в кілька банків?",
    answer: [
      "Зазвичай ні: ми обираємо один банк, обговорюємо його разом і подаємо туди.",
      "Але бувають ситуації, коли схвалення під питанням або підтискає час. Тоді можна подати в кілька банків і взяти той, який відповів. Це рішення теж приймаємо разом.",
    ],
  },

  /*
   * The differentiator: a stress test, a split, flexible facilities, and a full
   * calculation of every option.
   *
   * It opens on the work, not on a denial. The first draft began "Не «беріть
   * оцю ставку»" and Lena cut it — a question about which rate to fix, answered
   * by starting with what the adviser will not say, spends its first line on
   * her rather than on the reader. The point survives as the last line, where
   * it is a conclusion instead of a refusal.
   */
  {
    group: "Як це працює",
    question: "Як ви радите фіксувати ставку?",
    answer: [
      "Спершу дивлюся, яке у вас property, які цілі і яка зараз ситуація зі ставками, і проганяю ваші платежі через стрес-тест.",
      "Зазвичай ми будуємо split loan і дуже часто додаємо гнучкі інструменти: flexible facility, offset та інші. Це особливо важливо, якщо депозит менше 20%.",
      "Ви отримуєте повний розрахунок: скільки і як платите в кожному варіанті, з моїми рекомендаціями та аргументами. Рішення за вами. Моє завдання дати прозору картину з цифрами і стратегію на майбутнє, а не назвати одну цифру.",
    ],
  },

  /*
   * Does not open with "Ні", by Lena's instruction. The old version led with
   * the boundary and a reader took it as "no help here" before reaching the
   * part where there is quite a lot of help. The limit still gets stated; it
   * just goes last, where it reads as professional rather than as a refusal.
   *
   * The eValue number is attributed to the tool throughout, never to Lena:
   * "оцінка за eValue", not "я оцінюю". She is not a registered valuer and the
   * last paragraph says so.
   */
  {
    group: "Як це працює",
    question: "Чи допомагаєте ви обирати будинок?",
    answer: [
      "Я пояснюю загальні терміни й ситуацію на ринку в цілому, і ми можемо подивитися на конкретний будинок, який ви розглядаєте, з боку його інвестиційної перспективи.",
      "Більше того: коли клієнти шукають житло, я зазвичай можу надати звіт eValue по конкретному будинку, з оцінкою його вартості. Це дуже допомагає. Роблю це до п'яти будинків на кейс; якщо потрібно більше, обговорюємо окремо.",
      "При цьому я завжди залишаюся в межах своєї професійної кваліфікації mortgage and investment adviser: я не real estate agent і не оцінювач.",
    ],
  },

  {
    group: "Як це працює",
    question: "Чи можу я купити землю і будуватися?",
    answer: [
      "Так, це теж фінансується. Це складніше, ніж купити готовий будинок, і питання до депозиту буде інше. Кейси дуже різні, тому дивимося саме ваш.",
    ],
  },

  {
    group: "Інвестиції",
    question: "Чи можете ви допомогти з інвестиційною нерухомістю?",
    answer: [
      "Можу прорахувати цифри і побудувати фінансову стратегію разом з її перспективою. Рішення купувати чи ні приймаєте ви, і це ваша відповідальність.",
      "Чого я не роблю: не оцінюю вашу нерухомість і не даю жодних гарантій щодо зростання ринку.",
    ],
  },

  /*
   * Same shape as the house question: what she does, then more of what she
   * does, then the limit. The limit is narrowed to tax and accounting, because
   * that is where it actually falls — the risk arithmetic in the middle
   * paragraph is her own work, and a boundary drawn wider than it is would give
   * that away for nothing.
   */
  {
    group: "Інвестиції",
    question: "Чи знаєте ви, що таке debt recycling? Хочу використати кредит під інвестиції.",
    answer: [
      "Розумію, як це працює, і можу дати вам загальну картину.",
      "Більше того: можу порахувати ваші ризики з огляду на те, як ви плануєте використати кредит і яке у вас боргове навантаження, і проговорити з вами, чи варто це робити взагалі.",
      "Але я не tax adviser і не бухгалтер. У податкових питаннях я завжди раджу отримати окрему консультацію професіонала з податків і бухгалтерії.",
    ],
  },

  /*
   * ⚠️ "Безкоштовна" here is a fee claim and has to sit alongside the
   * Disclosure Statement's $250/hour consultancy line. Lena's instruction was
   * that the plan is free FOR HER CLIENTS — the qualifier is load-bearing.
   */
  {
    group: "Про роботу з адвайзером",
    question: "Які ще послуги, окрім іпотеки?",
    answer: [
      "KiwiSaver advice, investment advice, financial planning і wealth management.",
      "Багато моїх клієнтів складають financial plan. Для моїх клієнтів ця послуга безкоштовна.",
    ],
  },
];
