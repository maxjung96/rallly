import clsx from "clsx";
import { useTranslation } from "next-i18next";
import * as React from "react";
import { useForm } from "react-hook-form";

import Switch from "@/components/switch";
import Tooltip from "@/components/tooltip";

import { requiredString } from "../../utils/form-validation";
import { PollFormProps } from "./types";

export interface PollDetailsData {
  title: string;
  location: string;
  description: string;
  hidden: boolean;
  commentsEnabled: boolean;
  ifNeedBeEnabled: boolean;
  voteLimitPerOptionEnabled: boolean;
  voteLimitPerOption?: number;
}

export const PollDetailsForm: React.FunctionComponent<
  PollFormProps<PollDetailsData>
> = ({ name, defaultValues, onSubmit, onChange, className }) => {
  const { t } = useTranslation("app");
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setValue
  } = useForm<PollDetailsData>({ defaultValues });

  const [hidden, setHidden] = React.useState(defaultValues?.hidden ?? false);
  register("hidden");
  const [commentsEnabled, setCommentsEnabled] = React.useState(defaultValues?.commentsEnabled ?? true);
  register("commentsEnabled");
  const [ifNeedBeEnabled, setIfNeedBeEnabled] = React.useState(defaultValues?.ifNeedBeEnabled ?? true);
  register("ifNeedBeEnabled");
  const [voteLimitPerOptionEnabled, setVoteLimitPerOptionEnabled] = React.useState(defaultValues?.voteLimitPerOptionEnabled ?? false);
  register("voteLimitPerOptionEnabled");

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
        <label htmlFor="title">{t("title")}</label>
        <input
          type="text"
          id="title"
          className={clsx("input w-full", {
            "input-error": errors.title,
          })}
          placeholder={t("titlePlaceholder")}
          {...register("title", { validate: requiredString })}
        />
      </div>
      <div className="formField">
        <label htmlFor="location">{t("location")}</label>
        <input
          type="text"
          id="location"
          className="input w-full"
          placeholder={t("locationPlaceholder")}
          {...register("location")}
        />
      </div>
      <div>
        <label htmlFor="description">{t("description")}</label>
        <textarea
          id="description"
          className="input w-full"
          placeholder={t("descriptionPlaceholder")}
          rows={5}
          {...register("description")}
        />
      </div>
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
              // if (!checked) {
              //   setValue("voteLimitPerOption", undefined);
              // }
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
                { validate: (value, formValues) => value >= 1 || value === undefined,
                  valueAsNumber: true})}
        />
      </div>
    </form>
  );
};
