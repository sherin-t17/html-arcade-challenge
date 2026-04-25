// FEEE Arcade — 30 ORIGINAL questions inspired by Unit V
// "Fundamentals of Communication Engineering" of the FEEE syllabus,
// written from scratch with new scenarios and phrasing so students who
// memorized the material still need to think.

export type Question = {
  id: number;
  level: number;
  levelName: string;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const QUESTIONS: Question[] = [
  // ───── Level 1 — Communication Basics ─────
  {
    id: 1, level: 1, levelName: "Communication Basics",
    question: "In any communication system, what is the role of a transducer at the message stage?",
    options: [
      "It amplifies radio frequency signals",
      "It converts one form of energy into another (e.g. sound → electrical)",
      "It modulates the carrier wave",
      "It removes noise from the channel",
    ],
    correctIndex: 1,
    explanation: "A transducer like a microphone converts physical energy (sound, light) into an equivalent electrical signal so it can be processed.",
  },
  {
    id: 2, level: 1, levelName: "Communication Basics",
    question: "Arrange the basic blocks of a communication system in correct order.",
    options: [
      "Transmitter → Message → Channel → Output → Receiver",
      "Message → Transmitter → Channel → Receiver → Output",
      "Message → Receiver → Channel → Transmitter → Output",
      "Channel → Message → Transmitter → Receiver → Output",
    ],
    correctIndex: 1,
    explanation: "Information flows: Message/Intelligence → Transmitter → Communication Channel → Receiver → Output device.",
  },
  {
    id: 3, level: 1, levelName: "Communication Basics",
    question: "Which of the following is an example of a wire-line communication system?",
    options: ["FM radio broadcast", "Satellite TV", "Landline telephone", "Mobile phone call"],
    correctIndex: 2,
    explanation: "Wire-line systems use a physical cable (e.g. telephone lines). Radio, satellite and mobile use wireless channels.",
  },
  {
    id: 4, level: 1, levelName: "Communication Basics",
    question: "Why is wireless communication preferred for long-distance transmission?",
    options: [
      "It needs no transmitter",
      "Free space as a medium avoids the cost & loss of laying long cables",
      "It does not require modulation",
      "It works only at audio frequencies",
    ],
    correctIndex: 1,
    explanation: "Wireless uses free space/air as the channel, which makes very long ranges practical without physical cabling.",
  },

  // ───── Level 2 — Signals ─────
  {
    id: 5, level: 2, levelName: "Signals",
    question: "Which statement BEST describes an analog signal?",
    options: [
      "It takes only two discrete levels: 0 and 1",
      "Its amplitude varies continuously with time",
      "It exists only at sampled instants of time",
      "It is always a square wave",
    ],
    correctIndex: 1,
    explanation: "An analog signal varies smoothly and continuously in amplitude with respect to time (e.g. a pure sine wave).",
  },
  {
    id: 6, level: 2, levelName: "Signals",
    question: "Which two steps convert an analog signal into a digital signal?",
    options: [
      "Modulation and Demodulation",
      "Amplification and Filtering",
      "Sampling and Quantization",
      "Sampling and Modulation",
    ],
    correctIndex: 2,
    explanation: "ADC = Sampling (taking values at discrete time instants) + Quantization (rounding each sample and coding it).",
  },
  {
    id: 7, level: 2, levelName: "Signals",
    question: "A digital signal is best described as one that…",
    options: [
      "Has infinitely many amplitude values",
      "Is defined only at discrete instants of time",
      "Is the same as a carrier signal",
      "Cannot be transmitted electrically",
    ],
    correctIndex: 1,
    explanation: "Digital signals are discrete-time, quantized sequences — typically represented by 0s and 1s.",
  },

  // ───── Level 3 — Modulation Basics ─────
  {
    id: 8, level: 3, levelName: "Modulation",
    question: "What is the MAIN purpose of modulation in radio communication?",
    options: [
      "To convert digital signals into analog signals",
      "To raise the signal frequency so antennas of practical size can radiate it",
      "To remove noise from the message signal",
      "To reduce the speed of the signal",
    ],
    correctIndex: 1,
    explanation: "Low-frequency message signals need impractically large antennas, so we modulate them onto a high-frequency carrier.",
  },
  {
    id: 9, level: 3, levelName: "Modulation",
    question: "In a modulation system, the high-frequency signal that 'carries' the message is called…",
    options: ["Modulating signal", "Baseband signal", "Carrier signal", "IF signal"],
    correctIndex: 2,
    explanation: "The high-frequency reference wave used to carry information is the carrier; the message itself is the modulating signal.",
  },
  {
    id: 10, level: 3, levelName: "Modulation",
    question: "Which of these is NOT a type of pulse modulation?",
    options: [
      "Pulse Amplitude Modulation (PAM)",
      "Pulse Width Modulation (PWM)",
      "Pulse Position Modulation (PPM)",
      "Pulse Frequency Demodulation (PFD)",
    ],
    correctIndex: 3,
    explanation: "Standard pulse modulation schemes are PAM, PWM and PPM. 'PFD' is not a standard pulse modulation type.",
  },
  {
    id: 11, level: 3, levelName: "Modulation",
    question: "The reverse process of modulation, performed at the receiver, is called…",
    options: ["Re-modulation", "Demodulation", "Amplification", "Sampling"],
    correctIndex: 1,
    explanation: "Demodulation extracts the original message signal from the received modulated carrier.",
  },

  // ───── Level 4 — AM ─────
  {
    id: 12, level: 4, levelName: "Amplitude Modulation",
    question: "In Amplitude Modulation, which property of the carrier varies with the message?",
    options: ["Frequency", "Phase", "Amplitude", "Speed of propagation"],
    correctIndex: 2,
    explanation: "In AM, only the amplitude (envelope) of the carrier changes in step with the modulating signal's amplitude.",
  },
  {
    id: 13, level: 4, levelName: "Amplitude Modulation",
    question: "An AM modulation index 'm' greater than 1 (i.e. m > 100%) leads to…",
    options: [
      "Perfect modulation",
      "Over-modulation and envelope distortion",
      "Frequency modulation",
      "Increased carrier frequency",
    ],
    correctIndex: 1,
    explanation: "When m > 1 the envelope crosses zero and inverts, producing severe distortion known as over-modulation.",
  },
  {
    id: 14, level: 4, levelName: "Amplitude Modulation",
    question: "If a carrier amplitude is 10 V and the message amplitude is 5 V, what is the modulation index?",
    code: "m = Vm / Vc",
    options: ["0.2", "0.5", "1.0", "2.0"],
    correctIndex: 1,
    explanation: "m = Vm / Vc = 5 / 10 = 0.5, i.e. 50% modulation — a safe value below 100%.",
  },
  {
    id: 15, level: 4, levelName: "Amplitude Modulation",
    question: "AM broadcast transmitters typically operate in which frequency band?",
    options: ["3 – 30 Hz", "535 – 1605 kHz (medium wave)", "88 – 108 MHz", "3 – 30 GHz"],
    correctIndex: 1,
    explanation: "Standard AM broadcast band lies in the medium-wave region, roughly 535 – 1605 kHz.",
  },

  // ───── Level 5 — FM ─────
  {
    id: 16, level: 5, levelName: "Frequency Modulation",
    question: "In Frequency Modulation, what stays CONSTANT in the modulated wave?",
    options: ["Frequency", "Amplitude", "Phase", "Both amplitude and frequency"],
    correctIndex: 1,
    explanation: "Only the carrier's frequency varies with the message; its amplitude remains constant — a key noise-immunity advantage.",
  },
  {
    id: 17, level: 5, levelName: "Frequency Modulation",
    question: "Modulation index of FM is defined as…",
    options: [
      "Frequency deviation × modulating frequency",
      "Frequency deviation ÷ modulating frequency",
      "Carrier frequency ÷ modulating frequency",
      "Carrier amplitude ÷ modulating amplitude",
    ],
    correctIndex: 1,
    explanation: "mf = Δf / fm, the ratio of peak frequency deviation to the modulating signal frequency.",
  },
  {
    id: 18, level: 5, levelName: "Frequency Modulation",
    question: "Which is a major ADVANTAGE of FM over AM?",
    options: [
      "Smaller bandwidth requirement",
      "Better noise immunity and higher fidelity",
      "Simpler receiver circuitry",
      "Longer ground-wave range",
    ],
    correctIndex: 1,
    explanation: "Because information is in frequency (not amplitude), amplitude noise can be clipped — giving FM superior audio quality.",
  },
  {
    id: 19, level: 5, levelName: "Frequency Modulation",
    question: "Carson's rule estimates FM bandwidth as…",
    options: [
      "BW = Δf",
      "BW = fm",
      "BW = 2 (Δf + fm)",
      "BW = Δf − fm",
    ],
    correctIndex: 2,
    explanation: "Carson's rule: BW ≈ 2 (Δf + fm), where Δf is peak deviation and fm is the highest modulating frequency.",
  },

  // ───── Level 6 — Digital Modulation & Coding ─────
  {
    id: 20, level: 6, levelName: "Digital Modulation",
    question: "In ASK (Amplitude Shift Keying), how is binary data represented?",
    options: [
      "By two different carrier frequencies",
      "By two different carrier phases",
      "By presence (1) or absence (0) of the carrier amplitude",
      "By varying the pulse width of the carrier",
    ],
    correctIndex: 2,
    explanation: "ASK toggles the carrier on/off (or between two amplitudes) to represent binary 1 and 0 — the digital cousin of AM.",
  },
  {
    id: 21, level: 6, levelName: "Digital Modulation",
    question: "FSK (Frequency Shift Keying) represents binary 1 and 0 using…",
    options: [
      "Two different amplitudes of the carrier",
      "Two different frequencies of the carrier",
      "Two different phases of the carrier",
      "Two different pulse widths",
    ],
    correctIndex: 1,
    explanation: "FSK uses one carrier frequency for binary 1 and another for binary 0 — the digital cousin of FM.",
  },
  {
    id: 22, level: 6, levelName: "Digital Modulation",
    question: "In Non-Return to Zero (NRZ) line coding…",
    options: [
      "Logic 1 = positive pulse, logic 0 = negative pulse, no return to zero between bits",
      "Each bit returns to 0 V at the middle of the bit interval",
      "All bits are coded as positive pulses",
      "The signal is only defined for logic 1",
    ],
    correctIndex: 0,
    explanation: "In NRZ, logic 1 stays at +V and logic 0 stays at −V for the full bit duration, never returning to zero in between.",
  },
  {
    id: 23, level: 6, levelName: "Digital Modulation",
    question: "PSK (Phase Shift Keying) varies which property of the carrier with the data?",
    options: ["Amplitude", "Frequency", "Phase", "Bandwidth"],
    correctIndex: 2,
    explanation: "PSK changes the carrier's phase (e.g. 0° vs 180° for BPSK) according to the binary bit being transmitted.",
  },

  // ───── Level 7 — Propagation & Receivers ─────
  {
    id: 24, level: 7, levelName: "Propagation & Receivers",
    question: "Which type of radio wave travels along the surface of the earth and is used for local broadcasts up to ~1600 kHz?",
    options: ["Sky wave", "Space wave", "Ground (surface) wave", "Tropospheric wave"],
    correctIndex: 2,
    explanation: "Ground/surface waves hug the Earth's surface and serve local & regional broadcasts at low to medium frequencies.",
  },
  {
    id: 25, level: 7, levelName: "Propagation & Receivers",
    question: "Sky-wave propagation works because radio waves are…",
    options: [
      "Absorbed by the troposphere",
      "Reflected back by the ionosphere",
      "Refracted by ocean water",
      "Diffracted by tall buildings",
    ],
    correctIndex: 1,
    explanation: "HF sky waves bend/reflect off ionised layers (ionosphere) and return to Earth, enabling long-distance shortwave links.",
  },
  {
    id: 26, level: 7, levelName: "Propagation & Receivers",
    question: "In a superheterodyne AM receiver, the MIXER produces which key signal?",
    options: [
      "The original audio signal",
      "A constant Intermediate Frequency (IF) for further amplification",
      "The carrier signal at twice its frequency",
      "A purely DC voltage",
    ],
    correctIndex: 1,
    explanation: "Mixer + local oscillator translate the incoming RF down to a fixed IF (455 kHz for AM), simplifying selectivity & gain.",
  },
  {
    id: 27, level: 7, levelName: "Propagation & Receivers",
    question: "Why does an FM receiver use a LIMITER stage before the discriminator?",
    options: [
      "To boost the audio amplitude",
      "To clip amplitude variations and remove amplitude-based noise",
      "To convert FM into AM",
      "To shift the carrier frequency",
    ],
    correctIndex: 1,
    explanation: "FM info is in frequency, so amplitude noise can be clipped off by a limiter before the discriminator extracts the audio.",
  },

  // ───── Level 8 — TV, FAX & Spectrum ─────
  {
    id: 28, level: 8, levelName: "TV, FAX & Spectrum",
    question: "What is the standard bandwidth of a single TV channel in the spectrum?",
    options: ["1 MHz", "4.5 MHz", "6 MHz", "10 MHz"],
    correctIndex: 2,
    explanation: "Each conventional TV channel occupies a 6 MHz slot, of which the video baseband takes ~4.5 MHz.",
  },
  {
    id: 29, level: 8, levelName: "TV, FAX & Spectrum",
    question: "In colour TV, which three primary colours are used to compose every televised image?",
    options: [
      "Cyan, Magenta, Yellow",
      "Red, Blue, Green",
      "Red, Yellow, Black",
      "White, Grey, Black",
    ],
    correctIndex: 1,
    explanation: "Colour TV uses additive RGB — Red, Green and Blue — separated and recombined at the camera and receiver.",
  },
  {
    id: 30, level: 8, levelName: "TV, FAX & Spectrum",
    question: "The PAL colour TV standard adopted in India stands for…",
    options: [
      "Picture And Light",
      "Phase Alternation by Line",
      "Pulse Amplitude Logic",
      "Polarised Audio Line",
    ],
    correctIndex: 1,
    explanation: "PAL = Phase Alternation by Line, a colour TV system developed in Germany and adopted in India.",
  },
];
