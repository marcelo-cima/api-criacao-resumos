/* PARTE I */
create database resume_ai

create table usuarios (
id serial primary key,
nome text not null,
email text not null unique,
senha text not null
);


create table materias (
id serial primary key,
  nome text not null
);


create table resumos (
id serial primary key,
  usuario_id int references usuarios(id),
  materia_id int references materias(id),
  topicos text not null,
  descricao text not null,
  criado date not null default now()
);

insert into materias(nome) values
('Back-end'),
('Front-end'),
('Carreira'),
('Mobile'),
('Design'),
('Dados'),
('SQL');
