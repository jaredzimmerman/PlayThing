<template>
  <div id="app">
    <div class="container">
      <span class="time-text">{{ time }}</span
      >&nbsp;
      <span class="time-text" style="color: rgb(255,255, 255, 0.5);">{{
        meridian
      }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordClock',
  data() {
    return {
      time: '',
      meridian: '',
      interval: null
    }
  },
  created() {
    this.interval = setInterval(this.getNow, 1000)
  },
  beforeDestroy() {
    if (this.interval != null) {
      clearInterval(this.interval)
    }
  },
  methods: {
    getNow() {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const result = this.timeToWords(hours, minutes)
      this.time = result[0]
      this.meridian = result[1]
      // [this.time, this.meridian] = this.timeToWords(hours, minutes);
    },
    timeToWords(hours, minutes) {
      /*const numbersToWords = {
                      0: "twelve", 1: "one", 2: "two", 3: "three", 4: "four",
                      5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine",
                      10: "ten", 11: "eleven", 12: "twelve", 13: "one",
                      14: "two", 15: "three", 16: "four", 17: "five",
                      18: "six", 19: "seven", 20: "eight", 21: "nine",
                      22: "ten", 23: "eleven", 24: "twelve"
                  };*/
      const numbersToWords = {
        0: 'Twelve',
        1: 'One',
        2: 'Two',
        3: 'Three',
        4: 'Four',
        5: 'Five',
        6: 'Six',
        7: 'Seven',
        8: 'Eight',
        9: 'Nine',
        10: 'Ten',
        11: 'Eleven',
        12: 'Twelve',
        13: 'One',
        14: 'Two',
        15: 'Three',
        16: 'Four',
        17: 'Five',
        18: 'Six',
        19: 'Seven',
        20: 'Eight',
        21: 'Nine',
        22: 'Ten',
        23: 'Eleven',
        24: 'Twelve'
      }

      const minutesToWords = {
        0: "o'clock",
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five',
        6: 'six',
        7: 'seven',
        8: 'eight',
        9: 'nine',
        10: 'ten',
        11: 'eleven',
        12: 'twelve',
        13: 'thirteen',
        14: 'fourteen',
        15: 'fifteen',
        16: 'sixteen',
        17: 'seventeen',
        18: 'eighteen',
        19: 'nineteen',
        20: 'twenty',
        21: 'twenty-one',
        22: 'twenty-two',
        23: 'twenty-three',
        24: 'twenty-four',
        25: 'twenty-five',
        26: 'twenty-six',
        27: 'twenty-seven',
        28: 'twenty-eight',
        29: 'twenty-nine',
        30: 'thirty',
        31: 'thirty-one',
        32: 'thirty-two',
        33: 'thirty-three',
        34: 'thirty-four',
        35: 'thirty-five',
        36: 'thirty-six',
        37: 'thirty-seven',
        38: 'thirty-eight',
        39: 'thirty-nine',
        40: 'forty',
        41: 'forty-one',
        42: 'forty-two',
        43: 'forty-three',
        44: 'forty-four',
        45: 'forty-five',
        46: 'forty-six',
        47: 'forty-seven',
        48: 'forty-eight',
        49: 'forty-nine',
        50: 'fifty',
        51: 'fifty-one',
        52: 'fifty-two',
        53: 'fifty-three',
        54: 'fifty-four',
        55: 'fifty-five',
        56: 'fifty-six',
        57: 'fifty-seven',
        58: 'fifty-eight',
        59: 'fifty-nine'
      }

      let period = hours >= 12 ? 'in the afternoon' : 'in the morning'
      if (hours >= 18) {
        period = 'in the evening'
      } else if (hours >= 12) {
        period = 'in the afternoon'
      } else {
        period = 'in the morning'
      }

      hours = hours % 12
      hours = hours ? hours : 12 // the hour '0' should be '12'

      let hourWord = numbersToWords[hours]
      let minuteWord =
        minutes === 0 ? minutesToWords[0] : minutesToWords[minutes]

      return [`${hourWord} ${minuteWord}`, period]

      // return `${hourWord} ${minuteWord} ${period}`;
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Inter;
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.container {
  color: white;
  /*text-align: justify;*/
}

.time-text {
  /*font-size: 280px;*/
  font-size: 12vw;
  font-weight: 100;
  /*line-height: 338.86px;*/
  letter-spacing: 0.15em;
}
</style>
