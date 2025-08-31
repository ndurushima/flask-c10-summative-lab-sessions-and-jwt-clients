// src/styles/NotesStyles.js
import styled from "styled-components";
import { Button, Input, Textarea } from "../styles";

export const Container = styled.div`
  max-width: 900px;
  margin: 24px auto;
  padding: 0 16px;
`;

export const Title = styled.h2`
  margin: 8px 0 16px;
`;

export const CreateForm = styled.form`
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
`;

export const NoteInput = styled(Input)`
  width: 100%;
`;

export const NoteTextarea = styled(Textarea)`
  width: 100%;
  resize: vertical;
  min-height: 96px;
`;

export const ErrorText = styled.div`
  color: crimson;
  margin-bottom: 12px;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
`;

export const Card = styled.li`
  border: 1px solid #d0d7de;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
`;

export const NoteTitle = styled.h3`
  margin: 0 0 4px;
`;

export const NoteContent = styled.p`
  margin: 0;
  white-space: pre-wrap;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const Pager = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`;

export const PageInfo = styled.span`
  font-size: 14px;
`;

export const Spacer = styled.span`
  margin-left: auto;
  font-size: 14px;
`;

export const PerPageSelect = styled.select`
  margin-left: 6px;
`;

/* Buttons built on your shared Button component */
export const PrimaryBtn = styled(Button)``;  // use variant/color props when rendering
export const GhostBtn = styled(Button)`
  background: white;
  border: 1px solid #d0d7de;
  color: inherit;
`;
export const DangerBtn = styled(Button)`
  background: #d7263d;
  border: 1px solid #d7263d;
  color: white;
`;
export const NavBtn = styled(Button)`
  background: white;
  border: 1px solid #d0d7de;
  color: inherit;
  padding: 6px 10px;
  border-radius: 8px;
`;
