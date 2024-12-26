import { module, test } from "qunit";
import migrate from "../../../../migrations/settings/0001-migrate-from-deprecated-icon-names";

module(
  "Unit | Migrations | Settings | 0001-migrate-from-deprecated-icon-names",
  function () {
    test("migrate", function (assert) {
      const settings = new Map(
        Object.entries({
          Tiles_button_icon: "fa-th",
        })
      );

      const result = migrate(settings);

      const expectedResult = new Map(
        Object.entries({
          Tiles_button_icon: "table-cells",
        })
      );
      assert.deepEqual(Array.from(result), Array.from(expectedResult));
    });

    test("migrate empty settings", function (assert) {
      const settings = new Map(Object.entries({}));
      const result = migrate(settings);
      assert.deepEqual(Array.from(result), Array.from(settings));
    });

    test("migrate same settings", function (assert) {
      const settings = new Map(
        Object.entries({
          Tiles_button_icon: "table-cells",
        })
      );
      const result = migrate(settings);
      assert.deepEqual(Array.from(result), Array.from(settings));
    });
  }
);
