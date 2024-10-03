import { Input } from "../common/Input";
import { SelectNative } from "../common/SelectNative";


const DivisionsTable = ({
  xAxisStart,
  setXAxisStart,
  xAxisEnd,
  setXAxisEnd,
  numDivisions,
  setNumDivisions,
  divisionType,
  setDivisionType,
  showCustomDivisions,
  setShowCustomDivisions
}) => {
  return (
    <div>
      <table className="w-full">
        <tbody>
          <tr>
            <td>X-Axis Start</td>
            <td>
              <Input
                type="number"
                value={xAxisStart}
                onChange={(e) => setXAxisStart(parseFloat(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>X-Axis End</td>
            <td>
              <Input
                type="number"
                value={xAxisEnd}
                onChange={(e) => setXAxisEnd(parseFloat(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>Number of Divisions</td>
            <td>
              <Input
                type="number"
                value={numDivisions}
                onChange={(e) => setNumDivisions(parseInt(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>Division Type</td>
            <td>


              <SelectNative value={divisionType}
                onChange={(e) => setDivisionType(e.target.value)}>
                <option value="equal">Equal</option>
                <option value="1/3 octave">1/3 octave</option>

              </SelectNative>

            </td>
          </tr>
          <tr>
            <td>Show Custom Divisions</td>
            <td>
              <Input
                type="checkbox"
                checked={showCustomDivisions}
                onChange={(e) => setShowCustomDivisions(e.target.checked)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DivisionsTable;
