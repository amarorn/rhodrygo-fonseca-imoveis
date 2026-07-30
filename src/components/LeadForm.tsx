"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { INTEREST_OPTIONS, PRICE_RANGES, PROPERTY_TYPES } from "@/lib/constants";
import { useToast } from "@/components/Toast";
import type { FormVariant } from "@/types";

const baseSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
});

const heroSchema = baseSchema.extend({
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  propertyType: z.string().min(1, "Selecione o tipo"),
  priceRange: z.string().min(1, "Selecione a faixa de preço"),
  region: z.string().min(2, "Informe a região"),
});

const contactSchema = baseSchema.extend({
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  interest: z.string().min(1, "Selecione o interesse"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

const simpleSchema = baseSchema.extend({
  whatsapp: z.string().min(10, "WhatsApp inválido"),
});

const newsletterSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type HeroFormData = z.infer<typeof heroSchema>;
type ContactFormData = z.infer<typeof contactSchema>;
type SimpleFormData = z.infer<typeof simpleSchema>;
type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface LeadFormProps {
  variant: FormVariant;
  className?: string;
  submitLabel?: string;
  onSuccess?: () => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-rf-navy outline-none transition-colors focus:border-rf-gold focus:ring-2 focus:ring-rf-gold/20";

const errorClass = "border-red-400 focus:border-red-400 focus:ring-red-400/20";

export function LeadForm({
  variant,
  className,
  submitLabel,
  onSuccess,
}: LeadFormProps) {
  const { showToast } = useToast();

  if (variant === "newsletter") {
    return (
      <NewsletterForm className={className} showToast={showToast} />
    );
  }

  if (variant === "ebook" || variant === "exit-intent") {
    return (
      <SimpleForm
        variant={variant}
        className={className}
        submitLabel={submitLabel}
        showToast={showToast}
        onSuccess={onSuccess}
      />
    );
  }

  if (variant === "contact") {
    return (
      <ContactForm
        className={className}
        submitLabel={submitLabel}
        showToast={showToast}
      />
    );
  }

  return (
    <HeroForm
      className={className}
      submitLabel={submitLabel}
      showToast={showToast}
    />
  );
}

function HeroForm({
  className,
  submitLabel = "Quero encontrar meu imóvel",
  showToast,
}: {
  className?: string;
  submitLabel?: string;
  showToast: (msg: string) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormData>({ resolver: zodResolver(heroSchema) });

  const onSubmit = async (data: HeroFormData) => {
    await new Promise((r) => setTimeout(r, 800));
    showToast("Recebemos seus dados! Entraremos em contato em breve.");
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4", className)}
      noValidate
    >
      <FormHeader title="Encontre seu imóvel ideal" />
      <Field label="Nome Completo" error={errors.name?.message}>
        <input
          {...register("name")}
          className={cn(inputClass, errors.name && errorClass)}
          placeholder="Seu nome"
        />
      </Field>
      <Field label="E-mail" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          className={cn(inputClass, errors.email && errorClass)}
          placeholder="seu@email.com"
        />
      </Field>
      <Field label="WhatsApp" error={errors.whatsapp?.message}>
        <input
          {...register("whatsapp")}
          type="tel"
          className={cn(inputClass, errors.whatsapp && errorClass)}
          placeholder="(81) 99999-9999"
        />
      </Field>
      <Field label="Tipo de Imóvel" error={errors.propertyType?.message}>
        <select
          {...register("propertyType")}
          className={cn(inputClass, errors.propertyType && errorClass)}
          defaultValue=""
        >
          <option value="" disabled>
            Selecione
          </option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Faixa de Preço" error={errors.priceRange?.message}>
        <select
          {...register("priceRange")}
          className={cn(inputClass, errors.priceRange && errorClass)}
          defaultValue=""
        >
          <option value="" disabled>
            Selecione
          </option>
          {PRICE_RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Região de Interesse" error={errors.region?.message}>
        <input
          {...register("region")}
          className={cn(inputClass, errors.region && errorClass)}
          placeholder="Ex: Boa Viagem, Recife"
        />
      </Field>
      <SubmitButton loading={isSubmitting} label={submitLabel} />
    </form>
  );
}

function ContactForm({
  className,
  submitLabel = "Enviar Mensagem",
  showToast,
}: {
  className?: string;
  submitLabel?: string;
  showToast: (msg: string) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    showToast("Mensagem enviada com sucesso! Responderemos em breve.");
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4", className)}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" error={errors.name?.message}>
          <input
            {...register("name")}
            className={cn(inputClass, errors.name && errorClass)}
            placeholder="Seu nome"
          />
        </Field>
        <Field label="E-mail" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            className={cn(inputClass, errors.email && errorClass)}
            placeholder="seu@email.com"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="WhatsApp" error={errors.whatsapp?.message}>
          <input
            {...register("whatsapp")}
            type="tel"
            className={cn(inputClass, errors.whatsapp && errorClass)}
            placeholder="(81) 99999-9999"
          />
        </Field>
        <Field label="Interesse" error={errors.interest?.message}>
          <select
            {...register("interest")}
            className={cn(inputClass, errors.interest && errorClass)}
            defaultValue=""
          >
            <option value="" disabled>
              Selecione
            </option>
            {INTEREST_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Mensagem" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={4}
          className={cn(inputClass, "resize-none", errors.message && errorClass)}
          placeholder="Conte-me sobre o que você procura..."
        />
      </Field>
      <SubmitButton loading={isSubmitting} label={submitLabel} />
    </form>
  );
}

function SimpleForm({
  variant,
  className,
  submitLabel = "Quero meu e-book GRÁTIS",
  showToast,
  onSuccess,
}: {
  variant: "ebook" | "exit-intent";
  className?: string;
  submitLabel?: string;
  showToast: (msg: string) => void;
  onSuccess?: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SimpleFormData>({ resolver: zodResolver(simpleSchema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    showToast("E-book enviado! Verifique seu e-mail.");
    reset();
    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4", className)}
      noValidate
    >
      {variant === "exit-intent" && (
        <p className="text-sm text-gray-600">
          Receba GRÁTIS o e-book &quot;Guia Completo: Como Comprar seu Imóvel com
          Segurança&quot;
        </p>
      )}
      <Field label="Nome" error={errors.name?.message}>
        <input
          {...register("name")}
          className={cn(inputClass, errors.name && errorClass)}
          placeholder="Seu nome"
        />
      </Field>
      <Field label="E-mail" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          className={cn(inputClass, errors.email && errorClass)}
          placeholder="seu@email.com"
        />
      </Field>
      <Field label="WhatsApp" error={errors.whatsapp?.message}>
        <input
          {...register("whatsapp")}
          type="tel"
          className={cn(inputClass, errors.whatsapp && errorClass)}
          placeholder="(81) 99999-9999"
        />
      </Field>
      <SubmitButton loading={isSubmitting} label={submitLabel} />
      {variant === "exit-intent" && (
        <p className="text-center text-xs text-gray-500">
          🔒 Seus dados estão 100% seguros
        </p>
      )}
    </form>
  );
}

function NewsletterForm({
  className,
  showToast,
}: {
  className?: string;
  showToast: (msg: string) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    showToast("Inscrição realizada com sucesso!");
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex gap-2", className)}
      noValidate
    >
      <input
        {...register("email")}
        type="email"
        placeholder="Seu e-mail"
        className={cn(
          inputClass,
          "flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50",
          errors.email && errorClass
        )}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="shrink-0 rounded-lg bg-rf-gold px-4 py-3 text-sm font-semibold text-rf-navy transition-colors hover:bg-rf-gold-light disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "OK"}
      </button>
    </form>
  );
}

function FormHeader({ title }: { title: string }) {
  return (
    <div className="mb-2">
      <h3 className="font-display text-xl font-semibold text-rf-navy">{title}</h3>
      <p className="text-sm text-gray-500">Preencha e receba opções personalizadas</p>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-rf-gold px-6 py-3.5 text-sm font-semibold text-rf-navy shadow-gold transition-all hover:bg-rf-gold-light hover:shadow-lg disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Enviando...
        </>
      ) : (
        label
      )}
    </button>
  );
}
