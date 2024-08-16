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

/* Crie o comando para listar as matérias */
select * from materias;

/* Crie o comando para verificar se existe um usuário com um dado e-mail */
select nome from usuarios where email = $1;

/* Crie o comando para criar um usuário */
insert into usuarios(nome) values($1);

/* Crie o comando para criar um resumo */
insert into resumos(topicos, descricao) values($1, $2);

/* Crie o comando para listar os resumos que correspondem a um determinado usuário */
select * from resumos where usuario_id = $1;

/* Crie o comando para listar os resumos filtrados por uma matéria e que correspondem a um 
determinado usuário */
select * from resumos where usuario_id = $1 and materia_id = $2;

/* Crie o comando para verificar se um resumo com um determinado id pertence a um determinado 
usuário (lembre-se que um usuário é identificado pelo seu id */
select * from resumos where id = $1 and usuario_id = $1;

/* Crie o comando para editar todos os campos de um resumo especificado pelo seu id */
update resumos set topicos = $1 and descricao = $2 where id = $3

/* Crie o comando para deletar um resumo especificado pelo seu id */
delete from resumos where id = $1

/* Crie o comando para visualizar a quantidade de resumos gerados em um determinado mês e ano */
select * from resumos where extract(year from criado) = $1 and extract(month from criado) = $2;