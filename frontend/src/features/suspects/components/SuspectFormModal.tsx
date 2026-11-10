'use client';

import React, { useState, useEffect } from 'react';
import {
  Suspect,
  SuspectStatus,
  CreateSuspectInput,
  UpdateSuspectInput,
  SUSPECT_STATUS_LABELS,
} from '../domain/suspect';
import {
  Modal,
  Button,
  Input,
  Textarea,
  Select,
  ImageUpload,
  ErrorState,
} from '../../common/components';

export interface SuspectFormModalProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
  suspectToEdit?: Suspect | null;
  onSubmit: (data: CreateSuspectInput | UpdateSuspectInput) => Promise<void>;
}

export const SuspectFormModal: React.FC<SuspectFormModalProps> = ({
  open,
  onClose,
  caseId,
  suspectToEdit,
  onSubmit,
}) => {
  const [fullName, setFullName] = useState('');
  const [alias, setAlias] = useState('');
  const [description, setDescription] = useState('');
  const [suspicionLevel, setSuspicionLevel] = useState(0);
  const [status, setStatus] = useState<SuspectStatus>(SuspectStatus.PERSON_OF_INTEREST);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (suspectToEdit) {
      setFullName(suspectToEdit.fullName);
      setAlias(suspectToEdit.alias ?? '');
      setDescription(suspectToEdit.description ?? '');
      setSuspicionLevel(suspectToEdit.suspicionLevel);
      setStatus(suspectToEdit.status);
      setPhotoUrl(suspectToEdit.photoUrl);
    } else {
      setFullName('');
      setAlias('');
      setDescription('');
      setSuspicionLevel(0);
      setStatus(SuspectStatus.PERSON_OF_INTEREST);
      setPhotoUrl(null);
    }
    setFormError(null);
  }, [suspectToEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (fullName.trim().length < 3) {
      setFormError('El nombre completo debe tener al menos 3 caracteres');
      return;
    }

    try {
      setLoading(true);
      if (suspectToEdit) {
        await onSubmit({
          fullName: fullName.trim(),
          alias: alias.trim() ? alias.trim() : null,
          description: description.trim() ? description.trim() : null,
          suspicionLevel: Number(suspicionLevel),
          status,
          photoUrl: photoUrl || null,
        });
      } else {
        await onSubmit({
          caseId,
          fullName: fullName.trim(),
          alias: alias.trim() ? alias.trim() : null,
          description: description.trim() ? description.trim() : null,
          suspicionLevel: Number(suspicionLevel),
          status,
          photoUrl: photoUrl || null,
        });
      }
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar sospechoso';
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  const title = suspectToEdit
    ? `EDITAR FICHA DE SOSPECHOSO: ${suspectToEdit.fullName}`
    : 'VINCULAR NUEVA PERSONA DE INTERÉS / SOSPECHOSO';

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 text-papel">
        {formError && <ErrorState message={formError} />}

        {/* Fotografía del sospechoso */}
        <div>
          <label className="block text-xs font-mono text-papel-muted uppercase tracking-wider mb-1.5">
            Fotografía de Frente / Ficha Policial
          </label>
          <ImageUpload
            value={photoUrl ?? undefined}
            onChange={(url) => setPhotoUrl(url)}
            folder="suspects"
            label="Subir fotografía"
          />
        </div>

        <Input
          label="Nombre Completo *"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ej: Marcos Aurelio Delgado"
          required
        />

        <Input
          label="Alias o Nombre Clave"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Ej: El Sombra"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Condición Jurídica / Estado"
            value={status}
            onChange={(e) => setStatus(e.target.value as SuspectStatus)}
          >
            {Object.entries(SUSPECT_STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val} className="bg-grafito text-papel">
                {label}
              </option>
            ))}
          </Select>

          <div>
            <label className="block text-xs font-mono text-papel-muted uppercase tracking-wider mb-1.5">
              Nivel de Sospecha: {suspicionLevel}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={suspicionLevel}
              onChange={(e) => setSuspicionLevel(Number(e.target.value))}
              className="w-full h-2 bg-grafito-dark accent-alerta cursor-pointer rounded"
              aria-label="Nivel de sospecha en porcentaje"
            />
          </div>
        </div>

        <Textarea
          label="Descripción y Hallazgos"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Rasgos distintivos, coartadas contradictorias, vinculación con el lugar del hecho..."
          rows={3}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-grafito-light">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            CANCELAR
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {suspectToEdit ? 'GUARDAR CAMBIOS' : 'REGISTRAR SOSPECHOSO'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
