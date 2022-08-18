// (C) 2021 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardAttributeFilterProps,
    dashboardAttributeFilterToAttributeFilter,
} from "@gooddata/sdk-ui-dashboard";
import { AttributeFilterButtonV2, useAttributeFilterController } from "@gooddata/sdk-ui-filters";
import { areObjRefsEqual, filterAttributeElements, uriRef } from "@gooddata/sdk-model";

import entryPoint from "../dp_mkn_dashboard_filters_entry";

import React from "react";

function CustomAttributeFilter1(props: IDashboardAttributeFilterProps): JSX.Element {
    const { filter, onFilterChanged } = props;
    const attributeFilter = dashboardAttributeFilterToAttributeFilter(filter);
    const {
        isLoadingInitialElementsPage,
        elements,
        workingSelectionElements,
        isWorkingSelectionInverted,
        onSelect,
        onApply,
    } = useAttributeFilterController({
        filter: attributeFilter,
        onApply: (newFilter, isInverted) =>
            onFilterChanged({
                attributeFilter: {
                    ...filter.attributeFilter,
                    attributeElements: filterAttributeElements(newFilter),
                    negativeSelection: isInverted,
                },
            }),
    });

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 55,
                margin: "0 10px",
                fontSize: 12,
            }}
        >
            {isLoadingInitialElementsPage && "Loading..."}
            {elements.map((element) => {
                const isSelected =
                    (!isWorkingSelectionInverted && workingSelectionElements.includes(element)) ||
                    (isWorkingSelectionInverted && !workingSelectionElements.includes(element));
                return (
                    <div
                        style={{
                            backgroundColor: isSelected ? "yellow" : "white",
                            fontWeight: isSelected ? "bold" : "normal",
                            margin: 10,
                            border: "1px solid #000",
                            borderRadius: 5,
                            padding: 10,
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            const newSelection = workingSelectionElements.includes(element)
                                ? workingSelectionElements.filter((e) => e !== element)
                                : workingSelectionElements.concat([element]);
                            onSelect(newSelection, isWorkingSelectionInverted);
                            onApply();
                        }}
                        key={element.uri}
                    >
                        {element.title}
                    </div>
                );
            })}
        </div>
    );
}

function CustomAttributeFilter2(props: IDashboardAttributeFilterProps): JSX.Element {
    const { filter, onFilterChanged } = props;
    const attributeFilter = dashboardAttributeFilterToAttributeFilter(filter);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 55,
                margin: "0 10px",
            }}
        >
            <AttributeFilterButtonV2
                filter={attributeFilter}
                onApply={(newFilter, isInverted) =>
                    onFilterChanged({
                        attributeFilter: {
                            ...filter.attributeFilter,
                            attributeElements: filterAttributeElements(newFilter),
                            negativeSelection: isInverted,
                        },
                    })
                }
            />
        </div>
    );
}

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;


    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer,
    ): void {
        // Date filter can be replaced as well:
        // customize.filters().date().withCustomProvider()
    
        customize
            .filters()
            .attribute()
            .withCustomProvider((filter) => {
                // Use case, when we want to render different filter for specific display form
                // Note: replace this only with attributes with two or three elements
                // as it renders them right in the filter bar
                if (
                    areObjRefsEqual(
                        filter.attributeFilter.displayForm,
                        uriRef("/gdc/md/v8lb4wohuaz0pcvzofo1qvndpz7x3n91/obj/1027"),
                    )
                ) {
                    return CustomAttributeFilter1;
                }

                return CustomAttributeFilter2;
            });
    }
}
