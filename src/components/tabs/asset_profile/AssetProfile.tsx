import AssetChart from "./AssetChart"
import AssetPerformanceIndicators from "./AssetPerformanceIndicators"

const AssetProfile = () => {
  return (
    <div className="flex flex-col gap-3">
         <AssetPerformanceIndicators />
         <AssetChart/>
    </div>
  )
}

export default AssetProfile
