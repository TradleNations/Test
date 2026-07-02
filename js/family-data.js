/* =============================================================
   FAMILY DATA
   -------------------------------------------------------------
   This is the ONLY file you need to edit to add your own family.
   Replace the sample family below with your own.

   HOW IT WORKS
   ------------
   The tree is built top-down starting from the oldest ancestor
   couple (the "root"). Each person is an object. A person can
   have a `spouse` and a list of `children`. Each child is just
   another person object, so the structure nests as deep as you
   like.

   PERSON FIELDS (all optional except `name`)
   ------------------------------------------
     name    : "Full Name"                (required)
     born    : "1890"  or "12 Mar 1890"   (year is enough)
     died    : "1961"                     (leave out if living)
     photo   : "assets/grandpa.jpg"       (path or URL; optional)
     gender  : "m" | "f"                  (only tints the avatar)
     place   : "Dublin, Ireland"          (birthplace/hometown)
     notes   : "Founded the family farm." (shown in the details box)
     spouse  : { ...another person, but WITHOUT children... }
     children: [ ...array of person objects... ]

   TIP: Photos go in the /assets folder. Square images look best.
   ============================================================= */

const FAMILY_TITLE = "The Doe Family";
const FAMILY_SUBTITLE = "Four generations · 1890 – present";

const familyData = {
  name: "William Doe",
  born: "1890",
  died: "1961",
  gender: "m",
  place: "Boston, Massachusetts",
  notes: "The patriarch. Emigrated west and started the family homestead.",
  spouse: {
    name: "Margaret Doe",
    born: "1893",
    died: "1970",
    gender: "f",
    place: "Boston, Massachusetts",
    notes: "Known for her garden and her Sunday dinners.",
  },
  children: [
    {
      name: "Robert Doe",
      born: "1915",
      died: "1988",
      gender: "m",
      place: "Springfield",
      notes: "Served in the war, then ran the local hardware store.",
      spouse: {
        name: "Helen Doe",
        born: "1918",
        died: "1995",
        gender: "f",
      },
      children: [
        {
          name: "James Doe",
          born: "1942",
          gender: "m",
          place: "Springfield",
          notes: "Retired schoolteacher and amateur historian.",
          spouse: { name: "Susan Doe", born: "1945", gender: "f" },
          children: [
            {
              name: "Emily Carter",
              born: "1970",
              gender: "f",
              notes: "Doctor. Moved to Seattle.",
              spouse: { name: "David Carter", born: "1968", gender: "m" },
              children: [
                { name: "Olivia Carter", born: "2001", gender: "f" },
                { name: "Noah Carter", born: "2004", gender: "m" },
              ],
            },
            {
              name: "Michael Doe",
              born: "1973",
              gender: "m",
              notes: "Software engineer.",
            },
          ],
        },
        {
          name: "Patricia Doe",
          born: "1946",
          gender: "f",
          notes: "Artist and traveler.",
        },
      ],
    },
    {
      name: "Dorothy Reed",
      born: "1920",
      died: "2002",
      gender: "f",
      notes: "Married into the Reed family; a celebrated pianist.",
      spouse: { name: "Frank Reed", born: "1917", died: "1990", gender: "m" },
      children: [
        {
          name: "Nancy Reed",
          born: "1948",
          gender: "f",
          spouse: { name: "Paul Green", born: "1947", gender: "m" },
          children: [
            { name: "Laura Green", born: "1975", gender: "f" },
            { name: "Kevin Green", born: "1978", gender: "m" },
          ],
        },
      ],
    },
  ],
};
