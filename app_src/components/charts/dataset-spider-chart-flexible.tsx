"use client"

import { getDimensionAbbreviation, getDimensionDisplayName } from "@/lib/dimension-config"

interface DatasetSpiderChartFlexibleProps {
    data: { [model: string]: { [dimension: string]: number } }
    selectedModels: string[]
    selectedDimensions: string[]
}

export function DatasetSpiderChartFlexible({
    data,
    selectedModels,
    selectedDimensions,
}: DatasetSpiderChartFlexibleProps) {
    if (!data || Object.keys(data).length === 0) {
        return <div className="text-center py-8 text-gray-500">No data available</div>
    }

    if (selectedDimensions.length === 0) {
        return <div className="text-center py-8 text-gray-500">Please select at least one dimension to display</div>
    }

    if (selectedModels.length === 0) {
        return <div className="text-center py-8 text-gray-500">Please select at least one model to display</div>
    }

    const dimensions = selectedDimensions

    const svgWidth = 700
    const svgHeight = 600
    const center = { x: svgWidth / 2, y: svgHeight / 2 }
    const radius = 160
    const labelRadius = 210

    // For exactly 2 dimensions: place axes horizontally (left=180°, right=0°)
    // This creates a proper diamond shape instead of a collapsed vertical line
    const getAngle = (index: number, total: number) => {
        if (total === 2) {
            return index === 0 ? Math.PI : 0
        }
        return index * ((2 * Math.PI) / total) - Math.PI / 2
    }

    const colors = [
        "#3b82f6",
        "#ef4444",
        "#10b981",
        "#f59e0b",
        "#8b5cf6",
        "#06b6d4",
        "#f97316",
        "#84cc16",
        "#ec4899",
        "#6366f1",
    ]

    const axisPoints = dimensions.map((_, index) => {
        const angle = getAngle(index, dimensions.length)
        return {
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle),
            labelX: center.x + labelRadius * Math.cos(angle),
            labelY: center.y + labelRadius * Math.sin(angle),
            angle: angle,
        }
    })

    const getDimensionScore = (modelData: any, dimension: string): number => {
        return modelData[dimension] || 0
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex items-start gap-6 w-full justify-center overflow-x-auto">
                <svg width={svgWidth} height={svgHeight} className="border rounded bg-white shadow-sm flex-shrink-0">
                    {/* Grid circles */}
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => (
                        <circle
                            key={scale}
                            cx={center.x}
                            cy={center.y}
                            r={radius * scale}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Full horizontal axis line for 2D */}
                    {dimensions.length === 2 ? (
                        <line
                            x1={center.x - radius}
                            y1={center.y}
                            x2={center.x + radius}
                            y2={center.y}
                            stroke="#d1d5db"
                            strokeWidth="1.5"
                        />
                    ) : (
                        axisPoints.map((point, index) => (
                            <line key={index} x1={center.x} y1={center.y} x2={point.x} y2={point.y} stroke="#e5e7eb" strokeWidth="1" />
                        ))
                    )}

                    {/* Data polygons for each model */}
                    {selectedModels.map((model, modelIndex) => {
                        if (!data[model]) return null

                        const points = dimensions.map((dim, index) => {
                            const angle = getAngle(index, dimensions.length)
                            const score = getDimensionScore(data[model], dim)
                            const r = score * radius
                            return {
                                x: center.x + r * Math.cos(angle),
                                y: center.y + r * Math.sin(angle),
                            }
                        })

                        const pathData =
                            points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z"

                        const color = colors[modelIndex % colors.length]

                        return (
                            <g key={model}>
                                <path d={pathData} fill={`${color}25`} stroke={color} strokeWidth="2.5" />
                                {points.map((point, index) => (
                                    <circle key={index} cx={point.x} cy={point.y} r="5" fill={color} stroke="white" strokeWidth="1.5" />
                                ))}
                            </g>
                        )
                    })}

                    {/* Axis labels */}
                    {axisPoints.map((point, index) => {
                        const dimension = dimensions[index]
                        const displayLabel = getDimensionAbbreviation(dimension)
                        const fullName = getDimensionDisplayName(dimension)

                        let textAnchor: "start" | "middle" | "end" = "middle"
                        let dx = 0
                        let dy = 0

                        if (dimensions.length === 2) {
                            if (index === 0) {
                                textAnchor = "end"
                                dx = -14
                            } else {
                                textAnchor = "start"
                                dx = 14
                            }
                        } else {
                            const normalizedAngle = (point.angle + Math.PI * 2) % (Math.PI * 2)
                            if (normalizedAngle > Math.PI * 0.25 && normalizedAngle < Math.PI * 0.75) {
                                textAnchor = "middle"; dy = 15
                            } else if (normalizedAngle > Math.PI * 0.75 && normalizedAngle < Math.PI * 1.25) {
                                textAnchor = "end"; dx = -10
                            } else if (normalizedAngle > Math.PI * 1.25 && normalizedAngle < Math.PI * 1.75) {
                                textAnchor = "middle"; dy = -10
                            } else {
                                textAnchor = "start"; dx = 10
                            }
                        }

                        return (
                            <g key={index}>
                                <text
                                    x={point.labelX + dx}
                                    y={point.labelY + dy - 10}
                                    textAnchor={textAnchor}
                                    dominantBaseline="middle"
                                    style={{ fontSize: "15px", fontWeight: "700", fill: "#1f2937" }}
                                >
                                    {displayLabel}
                                </text>
                                <text
                                    x={point.labelX + dx}
                                    y={point.labelY + dy + 10}
                                    textAnchor={textAnchor}
                                    dominantBaseline="middle"
                                    style={{ fontSize: "11px", fill: "#6b7280" }}
                                >
                                    {fullName}
                                </text>
                            </g>
                        )
                    })}

                    {/* Scale labels */}
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => (
                        <text
                            key={scale}
                            x={center.x + 5}
                            y={center.y - radius * scale}
                            style={{ fontSize: "10px", fill: "#9ca3af" }}
                        >
                            {(scale * 100).toFixed(0)}%
                        </text>
                    ))}
                </svg>

                {/* Legend */}
                <div className="space-y-4 min-w-[200px] pt-4">
                    <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Models</h4>
                    <div className="space-y-2">
                        {selectedModels.map((model, index) => (
                            <div key={model} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded flex-shrink-0" style={{ backgroundColor: colors[index % colors.length] }} />
                                <span className="text-sm text-gray-700">{model}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-2">Dimensions</h4>
                        <div className="text-xs text-gray-600 space-y-2">
                            {selectedDimensions.map((dim) => (
                                <div key={dim} className="flex gap-2">
                                    <strong className="text-gray-800 min-w-[28px]">{getDimensionAbbreviation(dim)}:</strong>
                                    <span>{getDimensionDisplayName(dim)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-2">Score Scale</h4>
                        <div className="text-xs text-gray-500 space-y-1">
                            <div>Yes = 1.0</div>
                            <div>To some extent = 0.5</div>
                            <div>No = 0.0</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { DatasetSpiderChartFlexible as DatasetSpiderChart }
