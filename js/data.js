// Content for every topic in the guide, based on the official ACBL Standard
// American Yellow Card (SAYC) system booklet and convention card.
//
// To add a new topic: push another object onto PAGES with a unique id, a short
// label for the dropdown, and a render() function that returns an HTML string.

const SUIT_HTML = {
  S: '<span class="suit spade">&#9824;</span>',
  H: '<span class="suit heart">&#9829;</span>',
  D: '<span class="suit diamond">&#9830;</span>',
  C: '<span class="suit club">&#9827;</span>',
};

// Replaces tokens like {S} {H} {D} {C} in a string with colored suit symbols.
function suits(str) {
  return str.replace(/\{([SHDC])\}/g, (_, letter) => SUIT_HTML[letter]);
}

const SUIT_PLAIN = { S: '♠', H: '♥', D: '♦', C: '♣' };

// Plain-text version for contexts that can't render HTML, e.g. <option> labels.
function suitsPlain(str) {
  return str.replace(/\{([SHDC])\}/g, (_, letter) => SUIT_PLAIN[letter]);
}

// Renders a list of bid rows as mobile-friendly cards.
// items: [{ bid, points, desc }]
function bidList(items) {
  return `
    <div class="bid-list">
      ${items
        .map(
          (item) => `
        <div class="bid-card">
          <div class="bid-card-top">
            <span class="bid-name">${suits(item.bid)}</span>
            ${item.points ? `<span class="pill">${item.points}</span>` : ''}
          </div>
          ${item.desc ? `<p class="bid-desc">${suits(item.desc)}</p>` : ''}
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

// Collapsible "go deeper" content so beginner-facing pages stay short by default.
function advanced(title, innerHtml) {
  return `
    <details class="advanced">
      <summary>${suits(title)}</summary>
      <div class="advanced-body">${suits(innerHtml)}</div>
    </details>
  `;
}

function startCard(href, emoji, title, desc) {
  return `
    <a class="start-card" href="${href}">
      <span class="start-emoji" aria-hidden="true">${emoji}</span>
      <span class="start-text">
        <span class="start-title">${suits(title)}</span>
        <span class="start-desc">${suits(desc)}</span>
      </span>
      <span class="start-arrow" aria-hidden="true">&rsaquo;</span>
    </a>
  `;
}

const PAGES = [
  {
    id: 'start',
    label: 'Where Do I Start?',
    render: () => `
      <section class="topic">
        <h2>Where Do I Start?</h2>
        <p class="lede">
          Bidding always starts with the same question: <strong>what has already
          happened in the auction?</strong> Pick your situation below.
        </p>

        <div class="start-list">
          ${startCard('#counting', '🧮', 'First, know your hand', 'Count your High Card Points before anything else.')}
          ${startCard('#opening', '🃏', 'Nobody has bid yet', "It's your turn to open the bidding.")}
          ${startCard('#responses-suit', '🤝', 'Partner opened 1{C}, 1{D}, 1{H} or 1{S}', 'How to respond at the one level.')}
          ${startCard('#responses-nt', '🎯', 'Partner opened 1NT', 'Stayman, transfers, and other replies.')}
          ${startCard('#responses-strong-weak', '⚡', 'Partner opened 2{C}, or a weak two', 'The extra-strong and extra-weak openings.')}
          ${startCard('#overcalls', '🛡️', 'An opponent opened the bidding', 'Overcalls and takeout doubles.')}
        </div>

        <div class="callout">
          ${suits(`<strong>New to bridge?</strong> Bidding moves clockwise. Each
          player gets one turn per round and must either <em>pass</em> or bid
          higher than the last bid. Suits rank, low to high: {C} &lt; {D} &lt;
          {H} &lt; {S}, with No Trump (NT) highest of all.`)}
        </div>
      </section>
    `,
  },

  {
    id: 'counting',
    label: 'Counting Your Points',
    render: () => `
      <section class="topic">
        <h2>Counting Your Points</h2>
        <p class="lede">
          Before you can bid anything, you need to know what your hand is worth.
          Bridge measures hand strength in <strong>High Card Points (HCP)</strong>.
        </p>

        <h3>High card points</h3>
        <div class="bid-list compact">
          <div class="bid-card"><div class="bid-card-top"><span class="bid-name">Ace</span><span class="pill">4 pts</span></div></div>
          <div class="bid-card"><div class="bid-card-top"><span class="bid-name">King</span><span class="pill">3 pts</span></div></div>
          <div class="bid-card"><div class="bid-card-top"><span class="bid-name">Queen</span><span class="pill">2 pts</span></div></div>
          <div class="bid-card"><div class="bid-card-top"><span class="bid-name">Jack</span><span class="pill">1 pt</span></div></div>
        </div>

        <p>
          The full deck holds exactly <strong>40 HCP</strong>, so an average hand has
          10. Add up the points in your 13 cards &mdash; that number drives almost
          every decision in bidding.
        </p>

        <h3>Distribution points</h3>
        <p>Add these only after you and partner have agreed on a trump suit:</p>
        <div class="stat-row">
          <div class="stat-card">
            <div class="stat-value">+3</div>
            <div class="stat-label">Void<br /><span>0 cards in a suit</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-value">+2</div>
            <div class="stat-label">Singleton<br /><span>1 card in a suit</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-value">+1</div>
            <div class="stat-label">Doubleton<br /><span>2 cards in a suit</span></div>
          </div>
        </div>

        <div class="callout">
          <strong>Timing matters.</strong> A singleton is only valuable once you know
          partner has length to ruff into. Count HCP only until a fit is found, then
          add distribution points on top.
        </div>

        <h3>What your total means</h3>
        ${bidList([
          { bid: '0&ndash;12', points: '', desc: 'Not enough to open. Usually a pass.' },
          { bid: '13&ndash;21', points: '', desc: 'Open the bidding &mdash; see Opening Bids.' },
          { bid: '22+', points: '', desc: 'Too strong for a normal opening &mdash; open the artificial {C} (see Opening Bids).' },
        ])}
      </section>
    `,
  },

  {
    id: 'opening',
    label: 'Opening Bids',
    render: () => `
      <section class="topic">
        <h2>Opening Bids</h2>
        <p class="lede">
          The general rule is <strong>13 HCP</strong> to open at the one level.
          Borderline 11&ndash;12 point hands with good shape can use the
          <strong>Rule of 20</strong>: add your HCP to the length of your two longest
          suits &mdash; 20 or more means open.
        </p>

        ${bidList([
          { bid: 'Pass', points: '0&ndash;12', desc: 'No good opening. Pass and wait for partner or a better hand next time.' },
          { bid: '1{H} / 1{S}', points: '13&ndash;21', desc: '5+ cards in the suit &mdash; always a genuine 5-card-or-longer suit.' },
          { bid: '1{C} / 1{D}', points: '13&ndash;21', desc: '3+ cards in the suit (the "convenient minor"). See below for which one to pick.' },
          { bid: '1NT', points: '15&ndash;17', desc: 'Balanced hand: 4-3-3-3, 4-4-3-2, or 5-3-3-2 (no singleton or void).' },
          { bid: '2{C}', points: '22+', desc: 'Artificial and forcing. Shows a very strong hand of any shape (22+ points, or 9+ tricks); partner must keep bidding.' },
          { bid: '2{D} / 2{H} / 2{S}', points: '5&ndash;11', desc: 'Weak two. A good 6-card suit (occasionally a strong 5-carder).' },
          { bid: '2NT', points: '20&ndash;21', desc: 'Balanced &mdash; like a stronger 1NT.' },
          { bid: '3-level', points: '5&ndash;10', desc: '7-card suit, preemptive. Makes life hard for the opponents.' },
          { bid: '4-level', points: '4&ndash;9', desc: '8-card suit, preemptive.' },
        ])}

        <div class="callout">
          <strong>Which suit to open:</strong> Always open a 5-card major if you have
          one (open the higher of two 5-card suits). With no 5-card major, open your
          longer minor. With equal-length minors: <strong>3-3 &rarr; open
          ${suits('1{C}')}</strong>; <strong>4-4 (or longer) &rarr; open
          ${suits('1{D}')}</strong>.
        </div>

        ${advanced(
          '+ Rare hands: 3NT opening (25&ndash;27)',
          `<p>A balanced 25&ndash;27 HCP hand can open 3NT directly &mdash; a very
          strong balanced hand that doesn't fit neatly through 2{C}. You'll see this
          only a few times a year.</p>`
        )}
      </section>
    `,
  },

  {
    id: 'responses-suit',
    label: 'Responses: 1 of a Suit',
    render: () => `
      <section class="topic">
        <h2>${suits('Responding to 1{H} / 1{S} / 1{C} / 1{D}')}</h2>
        <p class="lede">Partner opened one of a suit at the one level. Here's how to describe your hand back.</p>

        <h3>${suits('Partner opened 1{H} or 1{S} (a major)')}</h3>
        ${bidList([
          { bid: 'New suit at the 1-level', points: '6+', desc: '4+ cards in a lower-ranking suit. Forcing for one round.' },
          { bid: '1NT', points: '6&ndash;9', desc: "Denies 4 spades (over 1{H}) or 3 hearts (over 1{S}). Not forcing." },
          { bid: 'New suit at the 2-level', points: '10+', desc: '4+ cards. Forcing for one round.' },
          { bid: 'Single raise (2 of the major)', points: '6&ndash;10', desc: '3+ card support.' },
          { bid: 'Limit raise (3 of the major)', points: '10&ndash;11', desc: '3+ card support. Invites game.' },
          { bid: 'Jacoby 2NT', points: '13+', desc: '4+ card support. Artificial, game-forcing raise that asks partner to show a short suit.' },
          { bid: 'Jump to game (4 of the major)', points: '&lt;10', desc: 'Usually 5+ card support with a singleton or void. A preemptive "shut the opponents out" raise.' },
        ])}

        ${advanced(
          '+ Bigger hands: jump shifts &amp; 3NT',
          `${bidList([
            { bid: '2{S} / 3{C} / 3{D} (jump shift)', points: '17+', desc: 'A strong new suit, forcing to game with slam interest.' },
            { bid: '3NT', points: '15&ndash;17', desc: 'Balanced, with only doubleton support for partner\'s major.' },
          ])}`
        )}

        <h3>${suits('Partner opened 1{C} or 1{D} (a minor)')}</h3>
        ${bidList([
          { bid: 'New suit (a major) at the 1-level', points: '6+', desc: '4+ cards. Forcing &mdash; look for a major fit before supporting the minor.' },
          { bid: 'Single raise (2 of the minor)', points: '6&ndash;9', desc: '4+ card support (5+ preferred when raising clubs).' },
          { bid: '1NT', points: '6&ndash;10', desc: 'Balanced, no 4-card major, no support for the minor.' },
          { bid: 'Limit raise (3 of the minor)', points: '10&ndash;12', desc: '4+ card support. Invites game.' },
          { bid: '2NT', points: '13&ndash;15', desc: 'Balanced, no 4-card major, no fit. Game-forcing.' },
          { bid: '3NT', points: '16&ndash;18', desc: 'Balanced, no 4-card major, no fit.' },
        ])}

        <div class="callout">
          <strong>Priority order:</strong> Look for a 4-card major first, then
          support partner's suit, then bid notrump. Always make the cheapest bid
          that accurately describes your hand.
        </div>
      </section>
    `,
  },

  {
    id: 'responses-nt',
    label: 'Responses: 1NT',
    render: () => `
      <section class="topic">
        <h2>Responding to 1NT (15&ndash;17)</h2>
        <p class="lede">
          Partner has a balanced 15&ndash;17. Two conventions do most of the work:
          Stayman and Jacoby transfers.
        </p>

        ${bidList([
          { bid: 'Pass', points: '0&ndash;7', desc: 'Not enough to invite or look for a major-suit fit.' },
          { bid: '2{C} &mdash; Stayman', points: '8+', desc: 'Artificial &amp; non-forcing. Asks opener for a 4-card major: opener bids 2{D} with none, or the major they hold (2{H} first with both).' },
          { bid: '2{D} &mdash; transfer to hearts', points: 'any', desc: '5+ hearts. Opener is forced to bid 2{H}.' },
          { bid: '2{H} &mdash; transfer to spades', points: 'any', desc: '5+ spades. Opener is forced to bid 2{S}.' },
          { bid: '2NT', points: '8&ndash;9', desc: 'Balanced, invites opener to bid 3NT with a maximum (17).' },
          { bid: '3NT', points: '10&ndash;15', desc: 'Balanced, no interest in a major-suit fit. To play.' },
        ])}

        <div class="callout">
          <strong>After a transfer:</strong> With just a 5-card major and minimum
          values, pass opener's forced bid. With extra strength or a 6-card suit,
          bid again to show it.
        </div>

        ${advanced(
          '+ Jump responses, Gerber &amp; super-accepts',
          `${bidList([
            { bid: '3{C} / 3{D} (jump)', points: '', desc: '6+ card minor, invitational to 3NT.' },
            { bid: '3{H} / 3{S} (jump)', points: '', desc: 'At least a 6-card major, slam interest, game-forcing.' },
            { bid: '4{C} &mdash; Gerber', points: '', desc: 'Asks for aces, just like Blackwood. Works over any 1NT or 2NT by partner.' },
          ])}
          <p>Opener may "super-accept" a transfer by jumping one level with 17
          points and 4-card support for responder's major (e.g. 1NT&ndash;2{D}&ndash;3{H}).</p>`
        )}
      </section>
    `,
  },

  {
    id: 'responses-strong-weak',
    label: 'Responses: 2{C} & Weak Twos',
    render: () => `
      <section class="topic">
        <h2>${suits('Responding to 2{C} and Weak Twos')}</h2>
        <p class="lede">
          These openings sit at the extremes &mdash; either enormously strong or
          deliberately weak &mdash; and responder's job changes accordingly.
        </p>

        <h3>${suits('Partner opened 2{C} (22+, artificial)')}</h3>
        ${bidList([
          { bid: '2{D}', points: '0&ndash;7', desc: 'Artificial "waiting" response &mdash; you don\'t have a positive response.' },
          { bid: '2{H} / 2{S} / 3{C} / 3{D}', points: '8+', desc: 'Natural and game-forcing. Shows a real 5+ card suit.' },
          { bid: '2NT', points: '8+', desc: 'Balanced hand, 8+ HCP.' },
        ])}

        <h3>${suits('Partner opened a weak two (2{D} / 2{H} / 2{S})')}</h3>
        ${bidList([
          { bid: 'Raise opener\'s suit', points: '', desc: 'To play. Can be preemptive (weak) &mdash; not forcing.' },
          { bid: '2NT', points: '', desc: 'Forcing, asks opener to describe: rebids the suit with a minimum (5&ndash;8), shows a feature (ace/king) with a maximum, or bids 3NT with no feature.' },
          { bid: 'New suit', points: '', desc: '5+ cards, forcing for one round ("RONF" &mdash; raises are the only non-forcing bid).' },
          { bid: '3NT', points: '', desc: 'To play.' },
        ])}
      </section>
    `,
  },

  {
    id: 'overcalls',
    label: 'Overcalls & Doubles',
    render: () => `
      <section class="topic">
        <h2>Overcalls & Takeout Doubles</h2>
        <p class="lede">
          An opponent opened the bidding and it's your turn. You can show your own
          suit, bid notrump, or double for takeout.
        </p>

        ${bidList([
          { bid: 'Simple suit overcall', points: '8&ndash;16', desc: '5+ card suit of reasonable quality. Not forcing on partner.' },
          { bid: '1NT overcall', points: '15&ndash;18', desc: "Balanced, preferably with a stopper in the opponent's suit." },
          { bid: 'Takeout double', points: '12+', desc: "Short (0&ndash;2 cards) in their suit, with support for the other three. Asks partner to pick a suit." },
          { bid: 'Jump overcall', points: '', desc: 'Preemptive &mdash; shows the same values as opening at that level.' },
        ])}

        <h3>Responding to partner's takeout double</h3>
        ${bidList([
          { bid: 'Cheapest available suit', points: '0&ndash;8', desc: 'You must respond even with 0 points &mdash; bid your longest/best suit.' },
          { bid: 'Jump in your suit', points: '9&ndash;11', desc: 'Invitational, shows extra strength.' },
          { bid: '1NT', points: '8&ndash;10', desc: "A stopper in the opponent's suit, balanced." },
          { bid: 'Cue-bid the opponent\'s suit', points: '12+', desc: 'Forcing, shows game-going values without a clear suit of your own.' },
        ])}

        <div class="callout">
          <strong>Remember:</strong> A takeout double says "I have opening values but
          no long suit of my own &mdash; partner, choose one." It is not a penalty
          double at this stage.
        </div>

        ${advanced(
          '+ Michaels cuebid &amp; 2NT overcall',
          `${bidList([
            { bid: 'Cuebid of opener\'s suit (Michaels)', points: '8+', desc: 'Shows 5-5 (or more) in the two other suits &mdash; both majors if they opened a minor, or the other major + an unspecified minor if they opened a major.' },
            { bid: 'Jump to 2NT', points: '', desc: 'Unusual notrump: shows at least 5-5 in the two lowest unbid suits.' },
          ])}`
        )}
      </section>
    `,
  },
];
