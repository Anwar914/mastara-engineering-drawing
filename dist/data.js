export const examples = [
  {
    "part": {
      "de": "Flansch mit Lochkreis",
      "en": "Flange with bolt circle",
      "ar": "فلنجة بدائرة ثقوب"
    },
    "items": [
      [
        "form",
        "▱",
        "0.05",
        "",
        {
          "de": "Ebenheit der Anlagefläche",
          "en": "Flatness of the seating face",
          "ar": "استواء سطح الارتكاز"
        },
        {
          "de": "Die gesamte Anlagefläche muss zwischen zwei parallele Ebenen im Abstand 0,05 mm passen. Die Ebenen dürfen sich zur Fläche ausrichten. Ein Bezug ist dafür nicht erforderlich.",
          "en": "The entire seating face must fit between two parallel planes 0.05 mm apart. The planes may orient to the face. No datum is required.",
          "ar": "يجب أن يقع سطح الارتكاز كله بين مستويين متوازيين تفصل بينهما 0.05 مم. يمكن توجيه المستويين حسب السطح دون مرجع."
        }
      ],
      [
        "location",
        "⌖",
        "⌀0.20",
        "A B C",
        {
          "de": "Position der Befestigungsbohrung",
          "en": "Position of the mounting hole",
          "ar": "موضع ثقب التثبيت"
        },
        {
          "de": "Die abgeleitete Mittellinie der markierten Bohrung muss innerhalb eines Zylinders mit ⌀0,20 mm um die theoretisch exakte Lage liegen. A ist die Anlagefläche, B die Achse der Zentrierbohrung und C die ebene Abflachung, die die Drehstellung festlegt.",
          "en": "The extracted median line of the marked hole must stay inside a ⌀0.20 mm cylinder at the theoretically exact position. A is the seating face, B the pilot-bore axis and C the flat that sets the angular orientation.",
          "ar": "يجب أن يقع الخط الوسطي المستخرج للثقب المحدد داخل أسطوانة قطرها 0.20 مم حول الموضع النظري. A سطح الارتكاز وB محور ثقب التمركز وC السطح المسطح الذي يحدد اتجاه الدوران."
        }
      ]
    ]
  },
  {
    "part": {
      "de": "Stufenwelle mit Nut",
      "en": "Stepped shaft with keyway",
      "ar": "عمود مدرّج بمجرى مفتاح"
    },
    "items": [
      [
        "form",
        "○",
        "0.02",
        "",
        {
          "de": "Rundheit des Lagersitzes",
          "en": "Roundness of the bearing seat",
          "ar": "استدارة مقعد المحمل"
        },
        {
          "de": "In jedem betrachteten Querschnitt muss die Umfangslinie zwischen zwei konzentrische Kreise mit 0,02 mm radialem Abstand passen. Der Mittelpunkt ist je Querschnitt frei; Bezug A spielt hier keine Rolle.",
          "en": "In each cross-section the circular profile must fit between two concentric circles 0.02 mm apart radially. The center is free in each section. Datum A is not used.",
          "ar": "في كل مقطع يجب أن يقع المحيط بين دائرتين متحدتي المركز بفاصل شعاعي 0.02 مم. مركز الدائرتين حر في كل مقطع ولا يُستخدم المرجع A."
        }
      ],
      [
        "runout",
        "↗",
        "0.03",
        "A",
        {
          "de": "Radialer Rundlauf",
          "en": "Radial circular runout",
          "ar": "الخفقان الدائري الشعاعي"
        },
        {
          "de": "Beim Drehen um die Bezugsachse A darf die Messuhr in einem festen Querschnitt höchstens 0,03 mm zwischen Minimum und Maximum anzeigen. Für weitere Querschnitte wird die Prüfung wiederholt.",
          "en": "Rotate about datum axis A. At a fixed cross-section the difference between maximum and minimum indicator readings may not exceed 0.03 mm. Repeat at other cross-sections.",
          "ar": "عند التدوير حول محور المرجع A لا يتجاوز الفرق بين أعلى وأدنى قراءة للمؤشر 0.03 مم في المقطع نفسه. يُكرر القياس في مقاطع أخرى."
        }
      ]
    ]
  },
  {
    "part": {
      "de": "Gabelkopf in zwei Ansichten",
      "en": "Clevis in two views",
      "ar": "رأس شوكي بمسقطين"
    },
    "items": [
      [
        "orientation",
        "∥",
        "0.04",
        "A",
        {
          "de": "Parallelität der Gabelwange",
          "en": "Parallelism of the clevis face",
          "ar": "توازي وجه الشوكة"
        },
        {
          "de": "Die markierte Innenfläche muss zwischen zwei Ebenen mit 0,04 mm Abstand liegen, die parallel zur Bezugsfläche A stehen. Der Abstand der beiden Wangen wird separat bemaßt.",
          "en": "The marked inner face must fit between two planes 0.04 mm apart, parallel to datum plane A. The gap between the arms is specified separately.",
          "ar": "يجب أن يقع الوجه الداخلي المحدد بين مستويين متوازيين مع المرجع A وتفصل بينهما 0.04 مم. يُحدَّد عرض الفتحة بين الذراعين ببعد مستقل."
        }
      ],
      [
        "orientation",
        "⟂",
        "⌀0.08",
        "B",
        {
          "de": "Rechtwinkligkeit der Bolzenbohrung",
          "en": "Perpendicularity of the pin bore",
          "ar": "تعامد ثقب المسمار"
        },
        {
          "de": "Die abgeleitete Mittellinie der Bohrung muss innerhalb eines Zylinders mit ⌀0,08 mm liegen, dessen Achse senkrecht zur seitlichen Bezugsfläche B steht. Die Lage der Bohrung wird separat festgelegt.",
          "en": "The extracted median line of the bore must lie inside a ⌀0.08 mm cylinder oriented perpendicular to side datum plane B. Bore location is specified separately.",
          "ar": "يجب أن يقع الخط الوسطي المستخرج للثقب داخل أسطوانة قطرها 0.08 مم ومحورها عمودي على السطح المرجعي الجانبي B. يُحدَّد موضع الثقب بشكل مستقل."
        }
      ]
    ]
  },
  {
    "part": {
      "de": "Flanschbuchse im Längsschnitt",
      "en": "Flanged bushing in section",
      "ar": "جلبة ذات فلنجة في مقطع طولي"
    },
    "items": [
      [
        "form",
        "⌭",
        "0.04",
        "",
        {
          "de": "Zylinderform des Außensitzes",
          "en": "Cylindricity of the outer seat",
          "ar": "أسطوانية سطح التركيب الخارجي"
        },
        {
          "de": "Die gesamte markierte Mantelfläche muss zwischen zwei koaxiale Zylinder mit 0,04 mm radialem Abstand passen. Beide Zylinder haben dieselbe freie Achse.",
          "en": "The entire marked surface must fit between two coaxial cylinders 0.04 mm apart radially. They share a freely positioned axis.",
          "ar": "يجب أن يقع السطح الأسطواني المحدد بأكمله بين أسطوانتين متحدتي المحور بفاصل شعاعي 0.04 مم. محور الأسطوانتين حر."
        }
      ],
      [
        "runout",
        "↗↗",
        "0.06",
        "A",
        {
          "de": "Gesamtplanlauf der Flanschfläche",
          "en": "Total axial runout of the flange face",
          "ar": "الخفقان المحوري الكلي لوجه الفلنجة"
        },
        {
          "de": "Die Buchse dreht um die aus der Innenbohrung abgeleitete Achse A. Die Messuhr tastet die Stirnfläche axial über mehrere Radien ab. Die Spannweite aller Messwerte darf 0,06 mm nicht überschreiten.",
          "en": "Rotate the bushing about axis A derived from its bore. Sweep the end face axially across multiple radii. The range of all indicator readings may not exceed 0.06 mm.",
          "ar": "تدور الجلبة حول المحور A المستمد من الثقب. يتحسس المؤشر وجه الفلنجة محورياً على عدة أنصاف أقطار. لا يتجاوز الفرق بين جميع القراءات القصوى والدنيا 0.06 مم."
        }
      ]
    ]
  }
];
