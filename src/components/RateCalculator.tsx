"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import Row from "@/components/Row";
import { findCommissionTier } from "@/constants/commission_rate";
import { roundTo, numberOrZero } from "@/lib/math";

export default function RateCalculator() {
  // Customer inputs
  const [priceINR, setPriceINR] = useState<string>("");
  const [qty, setQty] = useState<string>("1");

  // Show Less / Advanced
  const [simpleMode, setSimpleMode] = useState(true);

  // Config (editable/visible in advanced)
  const [fxRate, setFxRate] = useState<string>("1.65"); // INR → NPR
  const [servicePct, setServicePct] = useState<number>(0); // auto from tiers (readonly slider)
  const [serviceMin, setServiceMin] = useState<string>("100"); // INR min applies only when total INR < 500
  const [dutyPct] = useState<number>(10); // hidden for now
  const [shipBase, setShipBase] = useState<string>("250"); // not used in current INR total flow
  const [shipPerKg] = useState<string>("180");
  const [weightKg] = useState<string>("0.5");
  const [roundStep] = useState<number>(5);

  // Derived serviceCharge (INR)
  const [serviceCharge, setServiceCharge] = useState<number>(0);

  // Auto-select tier by NPR (but calculate shown charge in INR per your current UI)
  useEffect(() => {
    const inr = parseFloat(priceINR);
    if (!isFinite(inr) || inr <= 0) {
      setServicePct(0);
      setServiceCharge(0);
      return;
    }

    const fx = parseFloat(fxRate) || 1.65;
    const totalInr = inr * Math.max(1, parseInt(qty || "1", 10) || 1);

    // Tiers are NPR-based → convert to NPR for lookup
    const nprValue = totalInr * fx;
    const tier = findCommissionTier(totalInr);

    if (totalInr < 500) {
      // use minimum in INR when total INR < 500
      const minInr = numberOrZero(serviceMin);
      setServicePct(0);
      setServiceCharge(minInr);
    } else if (tier.isPercentage) {
      // percentage tier → show percent on slider & compute charge in INR
      const pct = tier.rate * 100; // 0.18 → 18
      setServicePct(pct);
      setServiceCharge(totalInr * tier.rate);
    } else {
      // flat NPR tier → convert to INR for display if needed (you currently show INR)
      setServicePct(0);
      const flatNpr = tier.rate;
      const flatInr = flatNpr / fx;
      setServiceCharge(flatInr);
    }
  }, [priceINR, qty, fxRate, serviceMin]);

  // Calculator block (kept minimal for your current INR-only total)
  const calc = useMemo(() => {
    const pINR =
      numberOrZero(priceINR) * Math.max(1, Math.floor(numberOrZero(qty)) || 1);
    const fx = numberOrZero(fxRate) || 1.65;

    // Current flow: total in INR = itemINR + serviceCharge (no duty/ship used in INR calc yet)
    const rawTotalInr = pINR + serviceCharge;
    const totalInr = rawTotalInr;

    return {
      pINR,
      fx,
      totalInr,
      totalNpr: totalInr * fx,
      serviceChargeInr: serviceCharge,
      servicePct,
    };
  }, [priceINR, qty, fxRate, serviceCharge, servicePct, roundStep]);

  const disabled = numberOrZero(priceINR) <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-neutral-900 dark:to-black">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Instant Rate Calculator
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Paste the product price (INR). We’ll estimate your service fee &
              total.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="simple">Show Less</Label>
            <Switch
              id="simple"
              checked={simpleMode}
              onCheckedChange={setSimpleMode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Inputs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Enter Product Details</CardTitle>
              <CardDescription>
                Only the product price and quantity are required. FX is
                auto-applied.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Product Price (INR) */}
                <div className="col-span-2 flex flex-col">
                  <Label className="mb-2 text-sm font-medium text-foreground">
                    Product Price (INR)
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-sm text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      inputMode="decimal"
                      type="text"
                      placeholder="e.g. 1999"
                      value={priceINR}
                      onChange={(e) =>
                        setPriceINR(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      className="h-11 w-full rounded-md border border-border/70 pl-8 pr-3 text-base focus:ring-2 focus:ring-ring focus-visible:outline-none"
                      aria-label="Product price in INR"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter the item price in INR (decimals allowed).
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex flex-col">
                  <Label className="mb-2 text-sm font-medium text-foreground">
                    Quantity
                  </Label>
                  <div className="relative">
                    <Input
                      inputMode="numeric"
                      type="number"
                      min={1}
                      placeholder="1"
                      value={qty}
                      onChange={(e) =>
                        setQty(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="h-11 w-full rounded-md border border-border/70 pr-20 text-base text-center focus:ring-2 focus:ring-ring focus-visible:outline-none"
                      aria-label="Quantity"
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() =>
                          setQty((prev) =>
                            Math.max(
                              1,
                              (parseInt(prev || "1") || 1) - 1
                            ).toString()
                          )
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() =>
                          setQty((prev) =>
                            ((parseInt(prev || "1") || 1) + 1).toString()
                          )
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter item quantity (min 1).
                  </p>
                </div>
              </div>

              {!simpleMode && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label className="mb-2 block">FX Rate (INR → NPR)</Label>
                      <Input inputMode="decimal" value={fxRate} readOnly />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Includes your spread.
                      </p>
                    </div>

                    <div>
                      <Label className="mb-2 block">Service Fee (%)</Label>
                      <div className="flex items-center gap-3">
                        <Slider
                          value={[servicePct]} // e.g. 18
                          min={0}
                          max={18}
                          step={0.5}
                          disabled
                          className="w-full"
                        />
                        <span className="ml-2 text-sm text-muted-foreground">
                          {servicePct.toFixed(0)}%
                        </span>
                      </div>

                      {/* Min fee input (when total INR < 500) */}
                      {parseFloat(priceINR || "0") * parseFloat(qty || "1") <
                        500 && (
                        <>
                          <Label className="my-2">
                            Service Fee Minimum (INR)
                          </Label>
                          <Input
                            inputMode="decimal"
                            value={serviceMin}
                            onChange={(e) =>
                              setServiceMin(
                                e.target.value.replace(/[^0-9.]/g, "")
                              )
                            }
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            Applies for total under ₹500.
                          </p>
                        </>
                      )}
                    </div>

                    {/* Service charge (read-only) when >= 500 INR */}
                    <div>
                      {parseFloat(priceINR || "0") * parseFloat(qty || "1") >=
                        500 && (
                        <>
                          <Label className="my-1 block">
                            Service Charge (INR)
                          </Label>
                          <Input
                            value={serviceCharge.toFixed(2)}
                            readOnly
                            className="bg-muted/40"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button disabled={disabled}>Calculate</Button>
                {disabled && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" /> Enter a valid INR price to
                    calculate
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right: Estimate */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Estimate</CardTitle>
              <CardDescription>
                Transparent breakdown (estimate only).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <Row label="Price × Qty (INR)">
                  ₹ {calc.pINR.toLocaleString("en-IN")}
                </Row>
                <Row label="FX (INR→NPR)">{calc.fx.toFixed(2)}</Row>
                <Separator />
                <Row label="Service Fee (INR)">
                  {parseFloat(calc.serviceChargeInr.toFixed(2)).toLocaleString(
                    "en-IN",
                    { maximumFractionDigits: 2, minimumFractionDigits: 2 }
                  )}
                </Row>
                <Separator />
                <Row label="Estimated Total (INR)" bold>
                  ₹{" "}
                  {calc.totalInr.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </Row>
                <Row label="Estimated Total (NPR)" bold>
                  रू{" "}
                  {calc.totalNpr.toLocaleString("ne-NP", {
                    maximumFractionDigits: 0,
                  })}
                </Row>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
