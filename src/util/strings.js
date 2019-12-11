function Strings () {}
Strings.RESERVERED1 = 0
Strings.RESERVERED2 = 1
Strings.RESERVERED3 = 2
Strings.RESERVERED4 = 3
Strings.RESERVERED5 = 4
Strings.RESERVERED6 = 5
Strings.RESERVERED7 = 6
Strings.RESERVERED8 = 7
Strings.RESERVERED9 = 8
Strings.RESERVERED10 = 9
Strings.RESERVERED11 = 10
Strings.RESERVERED12 = 11
Strings.RESERVERED13 = 12
Strings.RESERVERED14 = 13
Strings.RESERVERED15 = 14
Strings.RESERVERED16 = 15
Strings.RESERVERED17 = 16
Strings.RESERVERED18 = 17
Strings.RESERVERED19 = 18
Strings.RESERVERED20 = 19
Strings.RESERVERED21 = 20
Strings.RESERVERED22 = 21
Strings.RESERVERED23 = 22
Strings.RESERVERED24 = 23
Strings.RESERVERED25 = 24
Strings.RESERVERED26 = 25
Strings.RESERVERED27 = 26
Strings.RESERVERED28 = 27
Strings.RESERVERED29 = 28
Strings.RESERVERED30 = 29
Strings.RESERVERED31 = 30
Strings.RESERVERED32 = 31
Strings.RESERVERED33 = 32
Strings.RESERVERED34 = 33
Strings.RESERVERED35 = 34
Strings.RESERVERED36 = 35
Strings.RESERVERED37 = 36
Strings.RESERVERED38 = 37
Strings.RESERVERED39 = 38
Strings.RESERVERED40 = 39
Strings.RESERVERED41 = 40
Strings.RESERVERED42 = 41
Strings.RESERVERED43 = 42
Strings.RESERVERED44 = 43
Strings.RESERVERED45 = 44
Strings.RESERVERED46 = 45
Strings.RESERVERED47 = 46
Strings.RESERVERED48 = 47
Strings.RESERVERED49 = 48
Strings.RESERVERED50 = 49
Strings.RESERVERED51 = 50
Strings.RESERVERED52 = 51
Strings.RESERVERED53 = 52
Strings.RESERVERED54 = 53
Strings.RESERVERED55 = 54
Strings.RESERVERED56 = 55
Strings.RESERVERED57 = 56
Strings.RESERVERED58 = 57
Strings.RESERVERED59 = 58
Strings.RESERVERED60 = 59
Strings.RESERVERED61 = 60
Strings.RESERVERED62 = 61
Strings.RESERVERED63 = 62
Strings.RESERVERED64 = 63
Strings.RESERVERED65 = 64
Strings.RESERVERED66 = 65
Strings.RESERVERED67 = 66
Strings.RESERVERED68 = 67
Strings.RESERVERED69 = 68
Strings.RESERVERED70 = 69
Strings.RESERVERED71 = 70
Strings.RESERVERED72 = 71
Strings.RESERVERED73 = 72
Strings.RESERVERED74 = 73
Strings.RESERVERED75 = 74
Strings.RESERVERED76 = 75
Strings.RESERVERED77 = 76
Strings.RESERVERED78 = 77
Strings.RESERVERED79 = 78
Strings.RESERVERED80 = 79
Strings.RESERVERED81 = 80
Strings.RESERVERED82 = 81
Strings.RESERVERED83 = 82
Strings.RESERVERED84 = 83
Strings.RESERVERED85 = 84
Strings.RESERVERED86 = 85
Strings.RESERVERED87 = 86
Strings.RESERVERED88 = 87
Strings.RESERVERED89 = 88
Strings.RESERVERED90 = 89
Strings.RESERVERED91 = 90
Strings.RESERVERED92 = 91
Strings.RESERVERED93 = 92
Strings.RESERVERED94 = 93
Strings.RESERVERED95 = 94
Strings.RESERVERED96 = 95
Strings.RESERVERED97 = 96
Strings.RESERVERED98 = 97
Strings.RESERVERED99 = 98
Strings.RESERVERED100 = 99

Strings.COUNT = 100

/**
 * Formats a string in a manner similar to sprintf or Microsoft's String.Format() method.
 *
 * @example
 * Strings.format('{0} is not {1}! {0} {2}', 'Sale', 'Sail');
 * results in:
 * Sale is not Sail! Sale {2}
 * @param inArguments {String} The format string and ALL comma separated list of string parameters used to format the inFormat string.
 * @returns {String} The formatted string.
 */
Strings.format = function (inArguments, ...aArgs) {
  return inArguments.replace(
    /{(\d+)}/g,
    function (inMatch, inNumber) {
      return typeof aArgs[ inNumber ] !== 'undefined' ? aArgs[ inNumber ] : inMatch
    }
  )
}
module.exports = Strings
