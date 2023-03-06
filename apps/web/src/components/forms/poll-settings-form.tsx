import clsx from "clsx";
import {useTranslation} from "next-i18next";
import * as React from "react";
import {useForm} from "react-hook-form";

import Switch from "@/components/switch";
import Tooltip from "@/components/tooltip";

import {PollFormProps} from "./types";

export interface PollSettingsData {
    hidden: boolean;
    commentsEnabled: boolean;
    ifNeedBeEnabled: boolean;
    voteLimitPerOptionEnabled: boolean;
    voteLimitPerOption?: number;
    voteLimitPerParticipantEnabled: boolean;
    voteLimitPerParticipant?: number;
}

export const PollSettingsForm: React.FunctionComponent<
    PollFormProps<PollSettingsData>
> = ({name, defaultValues, onSubmit, onChange, className}) => {
    const {t} = useTranslation("app");
    const {
        handleSubmit,
        register,
        watch,
        formState: {errors},
        setValue
    } = useForm<PollSettingsData>({defaultValues});

    const [hidden, setHidden] = React.useState(defaultValues?.hidden ?? false);
    register("hidden");
    const [commentsEnabled, setCommentsEnabled] = React.useState(defaultValues?.commentsEnabled ?? true);
    register("commentsEnabled");
    const [ifNeedBeEnabled, setIfNeedBeEnabled] = React.useState(defaultValues?.ifNeedBeEnabled ?? true);
    register("ifNeedBeEnabled");
    const [voteLimitPerOptionEnabled, setVoteLimitPerOptionEnabled] = React.useState(defaultValues?.voteLimitPerOptionEnabled ?? false);
    register("voteLimitPerOptionEnabled");
    const [voteLimitPerParticipantEnabled, setVoteLimitPerParticipantEnabled] = React.useState(defaultValues?.voteLimitPerParticipantEnabled ?? false);
    register("voteLimitPerParticipantEnabled");

    React.useEffect(() => {
        if (onChange) {
            const subscription = watch(onChange);
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [onChange, watch]);

    return (
        <form
            id={name}
            className={clsx("max-w-full", className)}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="formField">
                <Tooltip
                    content={t("hiddenTooltip")}
                    placement="top"
                >
                    <label htmlFor="hidden">{t("hidden")}</label>
                </Tooltip>
                <br/>
                <Switch
                    checked={hidden}
                    onChange={(checked) => {
                        setHidden(checked);
                        setValue("hidden", checked);
                    }}
                />
            </div>
            <div className="formField">
                <Tooltip
                    content={t("commentsEnabledTooltip")}
                    placement="top"
                >
                    <label htmlFor="commentsEnabled">{t("commentsEnabled")}</label>
                </Tooltip>
                <br/>
                <Switch
                    checked={commentsEnabled}
                    onChange={(checked) => {
                        setCommentsEnabled(checked);
                        setValue("commentsEnabled", checked);
                    }}
                />
            </div>
            <div className="formField">
                <Tooltip
                    content={t("ifNeedBeEnabledTooltip")}
                    placement="top"
                >
                    <label htmlFor="ifNeedBeEnabled">{t("ifNeedBeEnabled")}</label>
                </Tooltip>
                <br/>
                <Switch
                    checked={ifNeedBeEnabled}
                    onChange={(checked) => {
                        setIfNeedBeEnabled(checked);
                        setValue("ifNeedBeEnabled", checked);
                    }}
                />
            </div>
            <div className="formField">
                <Tooltip
                    content={t("voteLimitPerOptionEnabledTooltip")}
                    placement="top"
                >
                    <label htmlFor="voteLimitPerOptionEnabled">{t("voteLimitPerOptionEnabled")}</label>
                </Tooltip>
                <br/>
                <Switch
                    checked={voteLimitPerOptionEnabled}
                    onChange={(checked) => {
                        setVoteLimitPerOptionEnabled(checked);
                        setValue("voteLimitPerOptionEnabled", checked);
                    }}
                />
                <input
                    type="number"
                    id="voteLimitPerOption"
                    min="1"
                    className="input w-full"
                    placeholder="1"
                    hidden={!voteLimitPerOptionEnabled}
                    {...register("voteLimitPerOption",
                        {
                            validate: (value) => (value ?? 1) >= 1 || isNaN(value),
                            setValueAs: v => v ? parseInt(v) : undefined
                        })}
                />
            </div>
            <div className="formField">
                <Tooltip
                    content={t("voteLimitPerParticipantEnabledTooltip")}
                    placement="top"
                >
                    <label htmlFor="voteLimitPerParticipantEnabled">{t("voteLimitPerParticipantEnabled")}</label>
                </Tooltip>
                <br/>
                <Switch
                    checked={voteLimitPerParticipantEnabled}
                    onChange={(checked) => {
                        setVoteLimitPerParticipantEnabled(checked);
                        setValue("voteLimitPerParticipantEnabled", checked);
                    }}
                />
                <input
                    type="number"
                    id="voteLimitPerParticipant"
                    min="1"
                    className="input w-full"
                    placeholder="1"
                    hidden={!voteLimitPerParticipantEnabled}
                    {...register("voteLimitPerParticipant",
                        {
                            validate: (value) => (value ?? 1) >= 1 || isNaN(value),
                            setValueAs: v => v ? parseInt(v) : undefined
                        })}
                />
            </div>
        </form>
    );
};
