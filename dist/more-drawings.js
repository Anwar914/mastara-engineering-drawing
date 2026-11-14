export const additionalDrawings = [
  {
    "example": {
      "part": {
        "de": "Welle mit Sicherungsringnut",
        "en": "Shaft with retaining ring groove",
        "ar": "عمود بمجرى حلقة تثبيت"
      },
      "items": [
        [
          "form",
          "—",
          "0.03",
          "",
          {
            "de": "Geradheit einer Mantellinie",
            "en": "Straightness of a surface line",
            "ar": "استقامة خط على السطح"
          },
          {
            "de": "Die markierte Mantellinie muss zwischen zwei parallele Geraden mit 0,03 mm Abstand passen. Die Zone bezieht sich auf das Linienprofil in der angegebenen Schnittebene.",
            "en": "The marked surface line must fit between two parallel straight lines 0.03 mm apart. The zone applies to the line profile in the indicated section plane.",
            "ar": "يجب أن يقع خط السطح المحدد بين مستقيمين متوازيين تفصل بينهما 0.03 مم في مستوى المقطع المحدد."
          }
        ],
        [
          "runout",
          "↗",
          "0.04",
          "A",
          {
            "de": "Rundlauf des rechten Sitzes",
            "en": "Circular runout of the right journal",
            "ar": "الخفقان الدائري للمقعد الأيمن"
          },
          {
            "de": "Drehe die Welle um die Bezugsachse A. Die Messuhr tastet radial an einer festen axialen Stelle. Der Unterschied zwischen größtem und kleinstem Messwert darf 0,04 mm betragen.",
            "en": "Rotate the shaft about datum axis A. Measure radially at a fixed axial location. The difference between the highest and lowest reading may be at most 0.04 mm.",
            "ar": "أدر العمود حول محور المرجع A وقِس شعاعياً عند موضع محوري ثابت. الحد الأقصى للفرق بين القراءتين القصوى والدنيا هو 0.04 مم."
          }
        ]
      ]
    },
    "geometry": {
      "body": "<path d=\"M44 125l6-6h102v-34h145v34h42v7h10v-7h81l6 6v70l-6 6h-81v-7h-10v7h-42v34H152v-34H50l-6-6z\"/><path d=\"M152 119v82m145-82v82M28 160H454\" class=\"axis\"/>",
      "marks": [
        "<path d=\"M155 85H294\"/>",
        "<path d=\"M352 119H430M352 201H430\"/>"
      ],
      "anchors": [
        [
          200,
          85
        ],
        [
          393,
          119
        ]
      ],
      "frames": [
        [
          157,
          26
        ],
        [
          326,
          52
        ]
      ],
      "dims": "<path d=\"M44 206v64m392-64v64M44 262h392m-392 0 9-3m-9 3 9 3m383-3-9-3m9 3-9 3M339 205v32m10-32v32\"/><text x=\"229\" y=\"255\">96</text><text x=\"351\" y=\"237\">1.8</text><text x=\"64\" y=\"112\">⌀28</text><text x=\"68\" y=\"226\">A</text>"
    },
    "zones": [
      "<path d=\"M35 48H255M35 87H255\"/><path class=\"actual\" d=\"M35 70q25-20 55-5t55-2 55 1 55-2\"/>",
      "<circle cx=\"145\" cy=\"72\" r=\"42\"/><circle cx=\"145\" cy=\"72\" r=\"29\"/><path d=\"M145 38v68m-34-34h68\" stroke-dasharray=\"4 4\"/><path class=\"actual\" d=\"M173 55l20-14\"/>"
    ]
  },
  {
    "example": {
      "part": {
        "de": "Nabe mit Passfedernut",
        "en": "Hub with a keyway",
        "ar": "صرّة بمجرى مفتاح"
      },
      "items": [
        [
          "orientation",
          "⟂",
          "0.05",
          "A",
          {
            "de": "Rechtwinkligkeit der Stirnfläche",
            "en": "Perpendicularity of the end face",
            "ar": "تعامد الوجه الطرفي"
          },
          {
            "de": "Die markierte Stirnfläche liegt zwischen zwei parallelen Ebenen mit 0,05 mm Abstand. Beide Ebenen stehen senkrecht zur Bezugsachse A der Bohrung.",
            "en": "The end face must fit between two parallel planes 0.05 mm apart. Both planes are perpendicular to the bore datum axis A.",
            "ar": "يجب أن يقع الوجه الطرفي بين مستويين متوازيين تفصل بينهما 0.05 مم وكلاهما عمودي على محور الثقب المرجعي A."
          }
        ],
        [
          "runout",
          "↗",
          "0.08",
          "A",
          {
            "de": "Planlauf auf einem Messkreis",
            "en": "Axial circular runout",
            "ar": "الخفقان الدائري المحوري"
          },
          {
            "de": "Die Messuhr tastet die Stirnfläche axial ab, während die Nabe um A dreht. Auf jedem Messkreis beträgt die zulässige Differenz zwischen Minimum und Maximum 0,08 mm.",
            "en": "Rotate about A with the indicator probing the face axially. On each measuring circle the maximum permitted range of readings is 0.08 mm.",
            "ar": "تُدار الصرّة حول A ويقيس المؤشر الوجه محورياً. على كل دائرة قياس لا يتجاوز فرق القراءات 0.08 مم."
          }
        ]
      ]
    },
    "geometry": {
      "body": "<circle cx=\"131\" cy=\"151\" r=\"86\"/><path d=\"M119 110v-15h24v15a43 43 0 1 1-24 0z\"/><path d=\"M31 151h200M131 52v199\" class=\"axis\"/><path d=\"M300 76h35v28h90v27H300zM300 171h125v27h-90v28h-35z\" fill=\"url(#hatch)\"/><path d=\"M282 151H444\" class=\"axis\"/>",
      "marks": [
        "<path d=\"M425 104v27m0 40v27\"/>",
        "<path d=\"M300 76v55m0 40v55\"/>"
      ],
      "anchors": [
        [
          425,
          118
        ],
        [
          300,
          104
        ]
      ],
      "frames": [
        [
          365,
          34
        ],
        [
          251,
          33
        ]
      ],
      "dims": "<path d=\"M300 228v34m125-60v60M300 255h125\"/><text x=\"350\" y=\"250\">64</text><text x=\"363\" y=\"146\">⌀52 H7</text><text x=\"368\" y=\"168\">A</text>"
    },
    "zones": [
      "<path d=\"M132 30v86m27-86v86M49 73H235\" stroke-dasharray=\"6 3\"/><path class=\"actual\" d=\"M145 30q12 21 0 41t1 45\"/><text x=\"216\" y=\"66\">A</text>",
      "<path d=\"M132 30v86m27-86v86M49 73H235\" stroke-dasharray=\"6 3\"/><path class=\"actual\" d=\"M145 30q12 21 0 41t1 45\"/><text x=\"216\" y=\"66\">A</text>"
    ]
  },
  {
    "example": {
      "part": {
        "de": "Kupplungsflansch mit sechs Bohrungen",
        "en": "Coupling flange with six holes",
        "ar": "فلنجة اقتران بستة ثقوب"
      },
      "items": [
        [
          "form",
          "⌒",
          "0.10",
          "",
          {
            "de": "Linienprofil des Übergangsradius",
            "en": "Line profile of the shoulder blend",
            "ar": "تفاوت منحنى نصف قطر الانتقال"
          },
          {
            "de": "Im angegebenen Längsschnitt muss das tatsächliche Profil zwischen zwei Hülllinien um die Sollkontur liegen. Die Zone hat hier eine Gesamtbreite von 0,10 mm.",
            "en": "In the indicated section, the actual profile must lie between two envelopes around the nominal contour. The total zone width here is 0.10 mm.",
            "ar": "في المقطع الطولي المحدد يجب أن يقع المنحنى الفعلي بين حدَّين حول المنحنى النظري. عرض المنطقة الكلي هنا 0.10 مم."
          }
        ],
        [
          "runout",
          "↗↗",
          "0.05",
          "A",
          {
            "de": "Gesamtplanlauf der Kupplungsfläche",
            "en": "Total axial runout of the coupling face",
            "ar": "الخفقان المحوري الكلي لوجه الاقتران"
          },
          {
            "de": "Drehe den Flansch um Bezugsachse A und fahre die markierte Stirnfläche mit dem axialen Taster über ihre Radien ab. Die Differenz aus dem größten und kleinsten Wert über die ganze geprüfte Fläche darf 0,05 mm betragen.",
            "en": "Rotate about A and sweep the marked face across its radii with an axial indicator. The range across the entire inspected face may be at most 0.05 mm.",
            "ar": "أدر الفلنجة حول A وحرّك المؤشر المحوري عبر أنصاف أقطار الوجه المحدد. لا يتجاوز الفرق بين القراءتين القصوى والدنيا على كامل السطح 0.05 مم."
          }
        ]
      ]
    },
    "geometry": {
      "body": "<circle cx=\"139\" cy=\"155\" r=\"97\"/><circle cx=\"139\" cy=\"155\" r=\"69\" class=\"axis\"/><circle cx=\"139\" cy=\"155\" r=\"31\"/><circle cx=\"139\" cy=\"86\" r=\"12\"/><circle cx=\"199\" cy=\"120.5\" r=\"12\"/><circle cx=\"199\" cy=\"189.5\" r=\"12\"/><circle cx=\"139\" cy=\"224\" r=\"12\"/><circle cx=\"79\" cy=\"189.5\" r=\"12\"/><circle cx=\"79\" cy=\"120.5\" r=\"12\"/><path d=\"M30 155H248m-109-110v220\" class=\"axis\"/><path d=\"M281 114h69q13 0 13-13V69h57v66H281zM281 175h139v66h-57v-32q0-13-13-13h-69z\" fill=\"url(#hatch)\"/><path d=\"M266 155H443\" class=\"axis\"/>",
      "marks": [
        "<path d=\"M349 114q14 0 14-14\"/>",
        "<path d=\"M420 69v66m0 40v66\"/>"
      ],
      "anchors": [
        [
          357,
          110
        ],
        [
          420,
          93
        ]
      ],
      "frames": [
        [
          268,
          40
        ],
        [
          360,
          28
        ]
      ],
      "dims": "<path d=\"M281 201v62m139-18v18M281 257h139\"/><text x=\"337\" y=\"253\">78</text><text x=\"296\" y=\"147\">⌀38 H7</text><text x=\"316\" y=\"172\">A</text>"
    },
    "zones": [
      "<path d=\"M31 98Q145-9 259 98M31 119Q145 12 259 119\"/><path class=\"actual\" d=\"M31 109Q84 59 133 64T259 110\"/>",
      "<path d=\"M132 30v86m27-86v86M49 73H235\" stroke-dasharray=\"6 3\"/><path class=\"actual\" d=\"M145 30q12 21 0 41t1 45\"/><text x=\"216\" y=\"66\">A</text>"
    ]
  }
];
