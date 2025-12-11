"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

// Temas disponibles
const THEMES = { light: "", dark: ".dark" } as const

// ----------------------------------------------------
// Tipos
// ----------------------------------------------------

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

// Recharts no exporta `Payload` en algunas versiones, así que lo definimos
export type Payload<ValueType = any, NameType = string> = {
  dataKey?: string
  name?: NameType
  value?: ValueType
  color?: string
  fill?: string
  payload?: Record<string, any>
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error("useChart must be used within a <ChartContainer />")
  return context
}

// ----------------------------------------------------
// ChartContainer
// ----------------------------------------------------

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ReactNode
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

// ----------------------------------------------------
// ChartStyle
// ----------------------------------------------------

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => cfg.theme || cfg.color
  )

  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

// ----------------------------------------------------
// Tooltip
// ----------------------------------------------------

type TooltipContentProps<ValueType = any, NameType = string> = {
  active?: boolean
  payload?: readonly Payload<ValueType, NameType>[] | null
  label?: string | number
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nameKey?: string
  labelKey?: string
  formatter?: (
    value: ValueType,
    name?: NameType,
    item?: Payload<ValueType, NameType>,
    index?: number,
    payload?: any
  ) => React.ReactNode
  labelFormatter?: (label: string | number, payload?: any) => React.ReactNode
  className?: string
  labelClassName?: string
  color?: string
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      active,
      payload,
      label,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      nameKey,
      labelKey,
      formatter,
      labelFormatter,
      className,
      labelClassName,
      color,
    },
    ref
  ) => {
    const { config } = useChart()
    const safePayload = Array.isArray(payload) ? payload : []

    if (!active || safePayload.length === 0) return null

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !safePayload.length) return null
      const [item] = safePayload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
  const formattedValue =
    typeof value === "number" ? value :
    typeof value === "string" ? value :
    String(value ?? "")
  return (
    <div className={cn("font-medium", labelClassName)}>
      {labelFormatter(formattedValue, safePayload)}
    </div>
  )
}

      return value ? <div className={cn("font-medium", labelClassName)}>{value}</div> : null
    }, [label, labelFormatter, safePayload, hideLabel, labelClassName, config, labelKey])

    const nestLabel = safePayload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {safePayload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload?.fill || item.color

            return (
              <div
                key={item.dataKey || index}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {!hideIndicator && (
                      <div
                        className={cn(
                          "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                          {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent":
                              indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          }
                        )}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value !== undefined && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {typeof item.value === "number" || typeof item.value === "bigint"
                            ? item.value.toLocaleString()
                            : String(item.value ?? "")}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

// ----------------------------------------------------
// Legend
// ----------------------------------------------------

type LegendContentProps<ValueType = any, NameType = string> = {
  payload?: readonly Payload<ValueType, NameType>[] | null
  verticalAlign?: "top" | "bottom" | "middle"
  hideIcon?: boolean
  nameKey?: string
  className?: string
}

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<HTMLDivElement, LegendContentProps>(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart()
    const safePayload = Array.isArray(payload) ? payload : []
    if (!safePayload.length) return null

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {safePayload.map((item, index) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          return (
            <div
              key={item.value?.toString() || index}
              className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            >
              {!hideIcon ? (
                itemConfig?.icon ? (
                  <itemConfig.icon />
                ) : (
                  <div
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: item.color }}
                  />
                )
              ) : null}
              {itemConfig?.label || item.name}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"

// ----------------------------------------------------
// Helper
// ----------------------------------------------------

function getPayloadConfigFromPayload<ValueType = any, NameType = string>(
  config: ChartConfig,
  payload: Payload<ValueType, NameType>,
  key: string
) {
  const payloadData = payload?.payload || payload
  let configLabelKey = key

  if (key in payload && typeof (payload as any)[key] === "string") {
    configLabelKey = (payload as any)[key]
  } else if (payloadData && typeof (payloadData as any)[key] === "string") {
    configLabelKey = (payloadData as any)[key]
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

// ----------------------------------------------------
// Exports
// ----------------------------------------------------

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
