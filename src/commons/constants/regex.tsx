export class RegexConst {
  /**
   * match characters, number and space: /^[A-Za-z0-9 ]+$/g
   */
  static readonly SPACE_CHAR_NUMERIC_ONLY_REGEX = /^[A-Za-z0-9 ]+$/g;
  /**
   * match characters, number and some special characters: @ . + - _: /^[A-Za-z0-9@.+\-_]+$/g
   */
  static readonly SPACE_CHAR_NUMERIC_AND_SPECIAL_REGEX = /^[A-Za-z0-9@.+\-_]+$/g;
  /**
   * match number only: /^[0-9]+$/g
   */
  static readonly ONLY_NUMERIC_REGEX = /^[0-9]+$/g;
  /**
   * match all character same: /^(.)\1{1,}$/g
   */
  static readonly SAME_CHARACTER_REGEX = /^(.)\1{1,}$/g;
  /**
   * match all character same: /^(.)\1{1,}$/g
   */
  static readonly MISS_CHARACTER_SPECIAL = /^(?=.*[!@#\$%\^&\*])/g;
  /**
   * match all character same: /^(.)\1{1,}$/g
   */
  static readonly EMAIL_REGREX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
  static readonly LINK_REGREX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
}
