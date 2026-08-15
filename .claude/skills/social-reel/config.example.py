"""Master Healer Kale reel config."""

TOTAL = 33.55
BED_START = 0.60  # one continuous audio pull from the trailer's own music

LEAD = 0.25
GAPS = [0.35, 0.30, 0.45, 0.45, 0.45, 0.45, 0.35, 0.45, 0.50, 0.00]

# (reel_t0, reel_t1, source_start). The trailer only carries ~29s of usable
# footage before its own logo card, and the reel runs 33.5s, so two cuts step
# back into the fight they just left. Both land inside busy combat where a
# rewind reads as another exchange rather than a repeat.
SEGS = [
    (0.00, 6.08, 0.30),    # Goblin's Cave, the party swinging while Kale stands
    (6.08, 11.44, 5.90),   # Underground Sewer, dire rats, health bars dropping
    (11.44, 15.81, 11.30), # Burst Heal mid-fight, stage cleared
    (15.81, 19.35, 15.70), # skill tree, Focus and Party Heal tooltips
    (19.35, 22.62, 19.30), # skill tree into the Deep Forest
    (22.62, 25.44, 20.70), # the Elderwood fight opening
    (25.44, 29.42, 23.60), # Elderwood boss taking damage
    (29.42, 33.55, 25.10), # the finish. Ends at source 29.2, before the
                           # trailer's own logo card, which would otherwise put
                           # the studio's title underneath ours on the reveal.
]

# Two builds, not one: the demonstrative opener lands first and clears, then the
# premise builds on its own. Each group is (spoken line index, [(shown, spoken)]).
CARD_GROUPS = [
    (0, [("CHECK OUT", "Check out"), ("THIS NEW GEM", "this new gem.")]),
    (1, [("IMAGINE AN RPG", "Imagine an RPG"), ("WHERE YOU", "where you"),
         ("NEVER ATTACK", "never attack.")]),
]

CHUNKS = {
    2: ["NOT ONCE"],
    3: ["YOU ARE THE HEALER", "AND YOUR PARTY", "IS THREE IDIOTS"],
    4: ["THE TANK IS ASLEEP", "ACTUALLY ASLEEP", "DURING BOSS FIGHTS"],
    5: ["SO YOU GET", "A MANA BAR", "AND EIGHTEEN SPELLS"],
    6: ["PARTY HEAL TAKES", "THREE SECONDS", "TO CAST"],
    7: ["AND THE BOSS", "WINDS UP IN TWO"],
    8: ["THAT IS THE WHOLE GAME", "AND IT IS", "GENUINELY AMAZING"],
}
SPOKEN = {
    2: ["Not once."],
    3: ["You are the healer,", "and your party", "is three idiots."],
    4: ["The tank is asleep.", "Actually asleep,", "during boss fights."],
    5: ["So you get", "a mana bar,", "and eighteen spells."],
    6: ["Party heal takes", "three seconds", "to cast."],
    7: ["And the boss", "winds up in two."],
    8: ["That is the whole game,", "and it is", "genuinely amazing."],
}
REVEAL_LINE = 9
# 18 characters at 88pt is 1584px on a 1080 frame, so the name breaks over two
# lines at 76 instead of shrinking to something nobody can read.
TITLE = "MASTER HEALER\\NKALE"
SCORE = "OUR SCORE  8.2 / 10"
SITE = "lifemeetspixel.com"
