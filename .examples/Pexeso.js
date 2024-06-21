/* Pexeso
 * 
 * Just for fun!
 * 
 * Usage:
 * Execute anywhere.
 * */

if (INDEX > 0) return;

const Dialogs = brackets.getModule("widgets/Dialogs");

const cards = [ //attribution: https://iconmonstr.com/
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M13 2.056v-1.056c0-.552-.448-1-1-1s-1 .448-1 1v1.052c-6.916.522-10.372 5.594-11 9.906 1.864-2.677 6.136-2.677 8 0 1.839-2.641 6.047-2.685 7.917 0 1.864-2.677 6.219-2.677 8.083 0-.625-4.291-4.125-9.333-11-9.902zm0 10.101v8.843c0 1.657-1.343 3-3 3s-3-1.343-3-3v-1h2v1c0 .551.449 1 1 1s1-.449 1-1v-8.866c.68-.226 1.27-.242 2 .023z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd"><path d="M13 24h-2v-5.126c-.806-.208-1.513-.661-2.039-1.274-.602.257-1.265.4-1.961.4-2.76 0-5-2.24-5-5 0-1.422.595-2.707 1.55-3.617-.348-.544-.55-1.19-.55-1.883 0-1.878 1.483-3.413 3.341-3.496.823-2.332 3.047-4.004 5.659-4.004 2.612 0 4.836 1.672 5.659 4.004 1.858.083 3.341 1.618 3.341 3.496 0 .693-.202 1.339-.55 1.883.955.91 1.55 2.195 1.55 3.617 0 2.76-2.24 5-5 5-.696 0-1.359-.143-1.961-.4-.526.613-1.233 1.066-2.039 1.274v5.126z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M8.011 6.215c-1.711-.009-3.86.918-5.499 2.557-.625.625-1.176 1.355-1.601 2.174 1.479-1.119 3.057-1.47 4.903-.434.544-1.437 1.27-2.9 2.197-4.297zm9.785 9.773c-1.516.991-3.007 1.706-4.297 2.21 1.036 1.848.686 3.424-.434 4.902.819-.424 1.549-.975 2.175-1.602 1.644-1.642 2.572-3.796 2.556-5.51zm6.152-15.946c-.412-.028-.816-.042-1.213-.042-8.602 0-13.498 6.558-15.28 11.833l4.728 4.729c5.428-1.946 11.817-6.661 11.817-15.172 0-.439-.017-.888-.052-1.348zm-9.888 9.91c-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0 .391 1.023 0 1.414-1.024.39-1.414 0zm2.828-2.828c-.781-.78-.781-2.047 0-2.828s2.048-.781 2.828 0c.781.781.781 2.047 0 2.828s-2.047.781-2.828 0zm-14.919 12.454l-.906-.906 5.208-5.188.906.906-5.208 5.188zm4.979 1.857l-.906-.906 3.636-3.664.906.906-3.636 3.664zm-6.042 2.565l-.906-.906 6.448-6.438.906.906-6.448 6.438z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M1.438 16.872l-1.438 7.128 7.127-1.438 12.642-12.64-5.69-5.69-12.641 12.64zm2.271 2.253l-.85-.849 11.141-11.125.849.849-11.14 11.125zm20.291-13.436l-2.817 2.819-5.69-5.691 2.816-2.817 5.691 5.689z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M5 5h-3v-1h3v1zm8 5c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zm11-4v15h-24v-15h5.93c.669 0 1.293-.334 1.664-.891l1.406-2.109h8l1.406 2.109c.371.557.995.891 1.664.891h3.93zm-19 4c0-.552-.447-1-1-1-.553 0-1 .448-1 1s.447 1 1 1c.553 0 1-.448 1-1zm13 3c0-2.761-2.239-5-5-5s-5 2.239-5 5 2.239 5 5 5 5-2.239 5-5z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M9.223 14.867l-1.28-1.85c-.944-1.361-.605-3.23.757-4.174l1.848-1.282 2.99 4.315-4.315 2.991zm5.549-3.844l4.316-2.989-1.282-1.849c-.942-1.363-2.812-1.702-4.174-.758l-1.851 1.281 2.991 4.315zm-4.694 5.078l2.99 4.316c1.164 1.681 3.035 2.583 4.936 2.583 3.284 0 5.996-2.666 5.996-6.006 0-1.179-.346-2.369-1.068-3.412l-2.989-4.314-9.865 6.833zm-4.47-6.77c.353-1.73-.451-2.938-1.033-4.231-1.024-2.284 1.565-3.706 3.042-1.643.193.27 2.067 2.863 2.067 2.863l1.191-.835-2.074-2.876c-.801-1.12-1.895-1.609-2.94-1.609-2.114 0-3.592 2.2-2.665 4.565.478 1.218 1.282 2.019.985 3.474-.247 1.207-1.803 2.077-3.367 1.023l-.814 1.209c2.463 1.658 5.164.238 5.608-1.94z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M15.526 11.409c-1.052.842-7.941 6.358-9.536 7.636l-2.697-2.697 7.668-9.504 4.565 4.565zm5.309-9.867c-2.055-2.055-5.388-2.055-7.443 0-1.355 1.356-1.47 2.842-1.536 3.369l5.61 5.61c.484-.054 2.002-.169 3.369-1.536 2.056-2.055 2.056-5.388 0-7.443zm-9.834 17.94c-2.292 0-3.339 1.427-4.816 2.355-1.046.656-2.036.323-2.512-.266-.173-.211-.667-.971.174-1.842l-.125-.125-1.126-1.091c-1.372 1.416-1.129 3.108-.279 4.157.975 1.204 2.936 1.812 4.795.645 1.585-.995 2.287-2.088 3.889-2.088 1.036 0 1.98.464 3.485 2.773l1.461-.952c-1.393-2.14-2.768-3.566-4.946-3.566z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M16 0v3h-8c-1.104 0-2 .896-2 2v17c0 1.104.896 2 2 2h8c1.104 0 2-.896 2-2v-22h-2zm-6 21h-2v-1h2v1zm0-2h-2v-1h2v1zm0-2h-2v-1h2v1zm3 4h-2v-1h2v1zm0-2h-2v-1h2v1zm0-2h-2v-1h2v1zm3 4h-2v-1h2v1zm0-2h-2v-1h2v1zm0-2h-2v-1h2v1zm0-3h-8v-8h8v8z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M14 19h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm0 2h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm.25 2h-4.5l1.188.782c.154.138.38.218.615.218h.895c.234 0 .461-.08.615-.218l1.187-.782zm3.75-13.799c0 3.569-3.214 5.983-3.214 8.799h-5.572c0-2.816-3.214-5.23-3.214-8.799 0-3.723 2.998-5.772 5.997-5.772 3.001 0 6.003 2.051 6.003 5.772zm4-.691v1.372h-2.538c.02-.223.038-.448.038-.681 0-.237-.017-.464-.035-.69h2.535zm-10.648-6.553v-1.957h1.371v1.964c-.242-.022-.484-.035-.726-.035-.215 0-.43.01-.645.028zm-3.743 1.294l-1.04-1.94 1.208-.648 1.037 1.933c-.418.181-.822.401-1.205.655zm10.586 1.735l1.942-1.394.799 1.115-2.054 1.473c-.191-.43-.423-.827-.687-1.194zm-3.01-2.389l1.038-1.934 1.208.648-1.041 1.941c-.382-.254-.786-.473-1.205-.655zm-10.068 3.583l-2.054-1.472.799-1.115 1.942 1.393c-.264.366-.495.763-.687 1.194zm13.707 6.223l2.354.954-.514 1.271-2.425-.982c.21-.397.408-.812.585-1.243zm-13.108 1.155l-2.356 1.06-.562-1.251 2.34-1.052c.173.433.371.845.578 1.243zm-1.178-3.676h-2.538v-1.372h2.535c-.018.226-.035.454-.035.691 0 .233.018.458.038.681z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M9 12.242v7.894l-4.291.864-.709-3.827 4.005-5.909c.331.382.352.46.995.978zm2 1.176v8.015l2.732 2.567 3.268-2.567-1.052-1.109 1.052-1.108-1.052-1.108 1.052-1.108v-3.583c-.941.381-1.955.583-3.001.583-1.045 0-2.059-.202-2.999-.582zm7.242-11.661c-2.131-2.131-5.424-2.25-7.687-.651-1.174.821-1.96 1.94-2.335 3.378-1.664-.087-2.72-.905-2.72-1.484 0-.6 1.128-1.46 2.898-1.494.42-.524.67-.822 1.42-1.36-.42-.086-.856-.146-1.318-.146-2.485 0-4.5 1.343-4.5 3 0 1.936 2.526 3 4.5 3 2.818 0 5.337-1.892 4.252-3.967.567-.912 1.682-.902 2.309-.275.975.975.24 2.625-1.146 2.544-.862 2.006-3.376 3-5.794 2.879.225 1.122.768 2.192 1.638 3.062 2.342 2.344 6.141 2.343 8.484 0 1.17-1.172 1.757-2.708 1.757-4.244 0-1.535-.586-3.07-1.758-4.242z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M11.861 2.716s.04 1.615.14 5.527c.02.775-.142 1.545-.471 2.247l-3.349 6.96c-.206.961.645 2.297 2.027 2.945 1.332.625 2.777.404 3.405-.398l3.35-6.96c.329-.702.79-1.332 1.397-1.812 3.051-2.38 4.366-3.416 4.366-3.416l-10.865-5.093zm2.657 10.896c-.234.5-.83.716-1.33.481s-.715-.83-.48-1.331c.234-.499.83-.715 1.33-.48s.714.831.48 1.33zm-1.384-13.612l10.866 5.093-.849 1.811-10.866-5.093.849-1.811zm-13.134 16.271c0 1.823.688 3.71 1.951 5.249 1.234 1.503 2.9 2.48 4.539 2.48 1.354 0 2.791-.87 3.447-2.177l-1.121-.649c-1.051 1.894-3.215 1.881-4.072.576-.777-1.186-.619-3.261.436-5.692 1.006-2.321-.332-4.08-2.084-4.08-1.554-.001-3.096 1.407-3.096 4.293zm1.392-1.104c.184-.921.728-1.906 1.704-1.906.838 0 1.537.83.906 2.284-.879 2.027-1.197 3.845-.947 5.292-1.342-1.559-2.059-3.69-1.663-5.67z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd"><path d="M21 11c0-.552-.448-1-1-1s-1 .448-1 1c0 .551.448 1 1 1s1-.449 1-1m3 .486c-1.184 2.03-3.29 4.081-5.66 5.323-1.336-1.272-2.096-2.957-2.103-4.777-.008-1.92.822-3.704 2.297-5.024 2.262.986 4.258 2.606 5.466 4.478m-6.63 5.774c-.613.255-1.236.447-1.861.573-1.121 1.348-2.796 2.167-5.287 2.167-.387 0-.794-.02-1.222-.061.647-.882.939-1.775 1.02-2.653-2.717-1.004-4.676-2.874-6.02-4.287-1.038 1.175-2.432 2-4 2 1.07-1.891 1.111-4.711 0-6.998 1.353.021 3.001.89 4 1.999 1.381-1.2 3.282-2.661 6.008-3.441-.1-.828-.399-1.668-1.008-2.499.429-.04.837-.06 1.225-.06 2.467 0 4.135.801 5.256 2.128.68.107 1.357.272 2.019.495-1.453 1.469-2.271 3.37-2.263 5.413.008 1.969.773 3.799 2.133 5.224"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd"><path d="M3 18h-2c-.552 0-1-.448-1-1v-2h15v-9h4.667c1.117 0 1.6.576 1.936 1.107.594.94 1.536 2.432 2.109 3.378.188.312.288.67.288 1.035v4.48c0 1.121-.728 2-2 2h-1c0 1.656-1.344 3-3 3s-3-1.344-3-3h-6c0 1.656-1.344 3-3 3s-3-1.344-3-3zm3-1.2c.662 0 1.2.538 1.2 1.2 0 .662-.538 1.2-1.2 1.2-.662 0-1.2-.538-1.2-1.2 0-.662.538-1.2 1.2-1.2zm12 0c.662 0 1.2.538 1.2 1.2 0 .662-.538 1.2-1.2 1.2-.662 0-1.2-.538-1.2-1.2 0-.662.538-1.2 1.2-1.2zm-4-2.8h-14v-10c0-.552.448-1 1-1h12c.552 0 1 .448 1 1v10zm3-6v3h4.715l-1.427-2.496c-.178-.312-.509-.504-.868-.504h-2.42z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M5 19h14v3h-14v-3zm17-12c-1.326 0-2.294 1.272-1.924 2.54.611 2.091-6.357 4.068-7.386-1.604-.262-1.444.021-1.823.728-2.532.359-.36.582-.855.582-1.404 0-1.104-.896-2-2-2s-2 .896-2 2c0 .549.223 1.045.582 1.403.706.71.989 1.089.728 2.532-1.029 5.675-7.996 3.694-7.386 1.604.37-1.267-.598-2.539-1.924-2.539-1.104 0-2 .896-2 2 0 1.22 1.082 2.149 2.273 1.98 1.635-.23 2.727 4.372 2.727 6.02h14c0-1.65 1.092-6.25 2.727-6.019 1.191.168 2.273-.761 2.273-1.981 0-1.104-.896-2-2-2z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M13 24h-7c-1.857-3.32-3.742-8.431-4-16h15c-.255 7.504-2.188 12.781-4 16zm5.088-14c-.051.688-.115 1.355-.192 2h1.707c-.51 1.822-1.246 3.331-2.539 4.677-.283 1.173-.601 2.25-.939 3.229 3.261-2.167 5.556-6.389 5.875-9.906h-3.912zm-7.714-3.001c4.737-4.27-.98-4.044.117-6.999-3.783 3.817 1.409 3.902-.117 6.999zm-2.78.001c3.154-2.825-.664-3.102.087-5.099-2.642 2.787.95 2.859-.087 5.099z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.492 5.861c0-.828-.671-1.5-1.5-1.5-.827 0-1.499.672-1.499 1.5s.672 1.5 1.499 1.5c.829 0 1.5-.672 1.5-1.5zm-2.537 3.941c-.077.17-.325.352-.574.352-.501 0-.482-.655-.482-1.105.452-.172.779-.597.779-.979 0-.49-.531-.709-1.184-.709-.653 0-1.183.219-1.183.709 0 .382.327.807.778.979 0 .447.016 1.103-.486 1.103-.223 0-.484-.161-.569-.35-.221-.489-.959-.154-.74.332.219.487.761.827 1.318.827.343 0 .652-.135.882-.382.229.247.538.382.881.382h.001c.555 0 1.097-.34 1.317-.827.22-.487-.52-.821-.738-.332zm-2.46-3.941c0-.828-.672-1.5-1.5-1.5-.827 0-1.499.672-1.499 1.5s.672 1.5 1.499 1.5c.828 0 1.5-.672 1.5-1.5zm16.502 12.291c0 4.944-3.591 5.834-5.007 5.842-.787.005-2.4.006-4.26.006-2.427-.02-2.156-3.012-.206-2.973h2.616l-.583-.796c-1.16-1.582-.791-3.569.897-4.835.529-.398-.07-1.195-.6-.801-1.881 1.412-2.465 3.546-1.579 5.432h-.742c-.928.015-1.732.41-2.185 1.171-.339.573-.65 1.744.139 2.801l-3.432-.003c1.37-1.689 1.019-4.989.934-5.642-.088-.665-1.077-.518-.991.131.223 1.69.275 5.405-1.993 5.509h-2.009c-2.084.008-1.944-3.024 0-2.999.561.007.259.008.999 0 1.009-3.56-1.719-5.422-1.274-8.788-1.907-.986-2.724-2.792-2.724-4.862 0-2.504 1.193-5.156 2.855-7.345 1.159 1.038 1.702 1.706 2.461 2.849.626-.158 1.705-.161 2.363 0 .792-1.201 1.333-1.866 2.461-2.849 3.764 4.989 2.736 8.65 2.691 8.849 2.108.819 4.24 2.061 5.916 3.579-.714-2.775-.713-4.724 1.513-7.111.907-.97 2.359.401 1.461 1.363-1.498 1.608-1.588 2.891-1.262 4.324.712 3.137 1.541 4.715 1.541 7.148zm-18.005-12.993c-.386 0-.7.315-.7.701 0 .385.314.7.7.7.386 0 .7-.315.7-.7 0-.386-.314-.701-.7-.701zm5.7.701c0 .385-.314.7-.7.7-.386 0-.701-.315-.701-.7 0-.386.315-.701.701-.701.386 0 .7.315.7.701z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M21.739 10.921c-1.347-.39-1.885-.538-3.552-.921 0 0-2.379-2.359-2.832-2.816-.568-.572-1.043-1.184-2.949-1.184h-7.894c-.511 0-.736.547-.07 1-.742.602-1.619 1.38-2.258 2.027-1.435 1.455-2.184 2.385-2.184 4.255 0 1.76 1.042 3.718 3.174 3.718h.01c.413 1.162 1.512 2 2.816 2 1.304 0 2.403-.838 2.816-2h6.367c.413 1.162 1.512 2 2.816 2s2.403-.838 2.816-2h.685c1.994 0 2.5-1.776 2.5-3.165 0-2.041-1.123-2.584-2.261-2.914zm-15.739 6.279c-.662 0-1.2-.538-1.2-1.2s.538-1.2 1.2-1.2 1.2.538 1.2 1.2-.538 1.2-1.2 1.2zm3.576-6.2c-1.071 0-3.5-.106-5.219-.75.578-.75.998-1.222 1.27-1.536.318-.368.873-.714 1.561-.714h2.388v3zm1-3h1.835c.882 0 1.428.493 2.022 1.105.452.466 1.732 1.895 1.732 1.895h-5.588v-3zm7.424 9.2c-.662 0-1.2-.538-1.2-1.2s.538-1.2 1.2-1.2 1.2.538 1.2 1.2-.538 1.2-1.2 1.2z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 24h-24v-2h1c2.996-4.904 3.945-12.985 4-16h7c.054 2.94 1.005 10.982 4 16h1.742l-.642-1.093c-1.195-2.145-1.948-4.546-2.501-6.924.268-1.659.385-3.106.401-3.983h5c.04 2.205.753 8.236 3 12h1v2zm-18.287-6h2l-1.167 3 4.167-5h-2l1.167-3-4.167 5zm12.924-12.915c.238-.522.759-.885 1.363-.885s1.125.363 1.363.885c.154-.08.328-.125.512-.125.621 0 1.125.511 1.125 1.14 0 .629-.504 1.14-1.125 1.14-.184 0-.358-.045-.512-.125-.238.522-.759.885-1.363.885s-1.125-.363-1.363-.885c-.154.08-.328.125-.512.125-.621 0-1.125-.511-1.125-1.14 0-.629.504-1.14 1.125-1.14.184 0 .358.045.512.125zm-10.637-.085c.198-2.182 1.785-4 3.5-4 .246 0 .478.059.683.164.316-.687 1.011-1.164 1.817-1.164s1.501.477 1.817 1.164c.205-.105.437-.164.683-.164.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5c-.246 0-.478-.059-.683-.164-.316.687-1.011 1.164-1.817 1.164-2.345 0-3.722-2.951-5 0h-1z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 24h-23v-16h6v-8h11v12h6v12zm-12-5h-3v4h3v-4zm4 0h-3v4h3v-4zm6 0h-2v4h2v-4zm-17 0h-2v4h2v-4zm11-5h-2v2h2v-2zm-5 0h-2v2h2v-2zm11 0h-2v2h2v-2zm-17 0h-2v2h2v-2zm11-4h-2v2h2v-2zm-5 0h-2v2h2v-2zm-6 0h-2v2h2v-2zm11-4h-2v2h2v-2zm-5 0h-2v2h2v-2zm5-4h-2v2h2v-2zm-5 0h-2v2h2v-2z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd"><path d="M8.829 19c-.412 1.165-1.524 2-2.829 2-1.446 0-2.654-1.025-2.937-2.387l-2.259-.452c-.468-.094-.804-.504-.804-.981v-10.18c0-.53.211-1.039.586-1.414s.884-.586 1.414-.586h4c0-.552.448-1 1-1h9c.552 0 1 .448 1 1h4c1.657 0 3 1.343 3 3v10c0 .552-.448 1-1 1h-3.171c-.412 1.165-1.524 2-2.829 2-1.305 0-2.417-.835-2.829-2h-5.342zm-2.829-2c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm11 0c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm5-3c-1.565-1.5-3.062-2-6-2v-5h4.5c.828 0 1.5.672 1.5 1.5v5.5zm-7-7h-5v5h5v-5zm-6 0h-5v5h5v-5z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M17 21.224v-12.772c1.106-.594 1.674-1.762 1.674-3.104 0-1.874-1.472-3.411-3.32-3.515-.768-1.068-2.221-1.833-3.739-1.833-.971 0-1.78.322-2.582.964-1.292-.422-2.747-.143-3.795.792-2.155-.342-4.238 1.244-4.238 3.501 0 1.396.819 2.581 2 3.15v12.817c0 .664-.336 1.203-1 1.203v1.573h16v-1.573c-.664 0-1-.539-1-1.203zm-12.314-17.935c.398 0 .769.12 1.077.326.383-.751 1.164-1.266 2.065-1.266.591 0 1.131.222 1.541.586.494-.814 1.39-1.359 2.412-1.359 1.255 0 2.319.82 2.684 1.955.214-.082.447-.126.689-.126 1.074 0 1.944.871 1.944 1.944s-.871 1.944-1.944 1.944c-.626 0-1.183-.296-1.539-.756-.493.423-1.134.679-1.835.679-.884 0-1.673-.408-2.19-1.045-.426.497-1.057.813-1.763.813-.604 0-1.155-.231-1.567-.611-.354.487-.927.804-1.574.804-2.756 0-2.79-3.888 0-3.888zm1.314 17.711v-12.719c.672.422 1.516.406 2 .267v12.452h-2zm12-1.585v-2.16c3.155-1.83 3.968-6.255 1.552-6.255h-1.552v-2h1.912c2.144 0 3.088 1.534 3.088 3.452 0 2.539-1.791 5.75-5 6.963z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M14 3h2.997v5h-2.997v-5zm9 1v20h-22v-24h17.997l4.003 4zm-17 5h12v-7h-12v7zm14 4h-16v9h16v-9z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd"><path d="M5.786 15.237c-.545-1.685-.222-3.742.897-5.571 1.605 3.433 4.177 5.993 7.673 7.637-1.823 1.123-3.877 1.454-5.561.921.043 2.092-.952 4.468-2.249 5.776l-.727-2.182-1.666-.211-.157-1.611-1.634-.181-.18-1.634-2.182-.727c1.316-1.271 3.71-2.196 5.786-2.217m11.484-.827c-.524.841-1.191 1.581-1.945 2.202-3.654-1.578-6.339-4.15-7.95-7.92.621-.764 1.371-1.43 2.197-1.951 1.605 3.446 4.18 6.017 7.698 7.669m-2.031-8.626c.02-2.075.946-4.47 2.215-5.784l.728 2.182 1.634.179.18 1.634 1.612.158.211 1.665 2.181.727c-1.307 1.297-3.682 2.292-5.775 2.249.452 1.427.283 3.119-.462 4.712-3.31-1.538-5.756-3.946-7.287-7.26 1.61-.759 3.322-.927 4.763-.462"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M2.396 12h-2.396v-2h2.396v2zm7.604-6.458v-3.542h-2v3.542h2zm-4.793.876l-2.156-2.156-1.414 1.414 2.156 2.156 1.414-1.414zm9.461-2.396l-2.115 2.114 1.414 1.414 2.115-2.114-1.414-1.414zm-11.7 10.907l-2.198 1.919 1.303 1.517 2.198-1.919-1.303-1.517zm21.032 2.793c0 2.362-1.95 4.278-4.354 4.278h-10.292c-2.404 0-4.354-1.916-4.354-4.278 0-.77.211-1.49.574-2.113-.964-.907-1.574-2.18-1.574-3.609 0-2.762 2.238-5 5-5 1.329 0 2.523.528 3.414 1.376.649-.24 1.35-.376 2.086-.376 3.171 0 5.753 2.443 5.921 5.516 2.034.359 3.579 2.105 3.579 4.206zm-18-5.722c0 .86.37 1.628.955 2.172.485-.316 1.029-.551 1.624-.656.088-1.61.843-3.042 1.994-4.046-.46-.288-.991-.47-1.573-.47-1.654 0-3 1.346-3 3z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M17.945 8c-1.139 0-2.377.129-3.395.491-2.283.828-2.791.838-5.102 0-1.016-.362-2.257-.491-3.393-.491-1.971 0-4.17.387-6.055.878v1.789c.848.255 1.068.627 1.203 1.493.381 2.443 1.256 4.84 5.068 4.84 3.037 0 4.051-2.259 4.723-4.345.34-1.06 1.662-1.087 2.008-.015.674 2.089 1.682 4.36 4.725 4.36 3.814 0 4.689-2.397 5.07-4.841.135-.866.355-1.237 1.203-1.493v-1.788c-1.887-.491-4.084-.878-6.055-.878zm-15.472 4.915c-.117-.357-.223-.724-.312-1.101-.352-1.473-.043-1.789.434-2.074.695-.418 1.973-.665 3.295-.732-2.437.554-3.474 1.117-3.417 3.907zm11.75 0c-.117-.357-.223-.724-.312-1.101-.352-1.473-.043-1.789.434-2.074.695-.418 1.973-.665 3.295-.732-2.437.554-3.474 1.117-3.417 3.907z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M4.069 13h-4.069v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm11.209 1.414l2.881-2.881-1.414-1.414-2.881 2.881c.528.411 1.002.886 1.414 1.414zm-6.312-3.102c.339 0 .672.028 1 .069v-4.069h-2v4.069c.328-.041.661-.069 1-.069zm0 16c-.339 0-.672-.028-1-.069v4.069h2v-4.069c-.328.041-.661.069-1 .069zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-3.033 7.312l2.88 2.88 1.415-1.414-2.88-2.88c-.412.528-.886 1.002-1.415 1.414zm-11.21-1.415l-2.88 2.88 1.414 1.414 2.88-2.88c-.528-.411-1.003-.885-1.414-1.414zm6.312-10.897c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M20.581 19.049c-.55-.446-.336-1.431-.907-1.917.553-3.365-.997-6.331-2.845-8.232-1.551-1.595-1.051-3.147-1.051-4.49 0-2.146-.881-4.41-3.55-4.41-2.853 0-3.635 2.38-3.663 3.738-.068 3.262.659 4.11-1.25 6.484-2.246 2.793-2.577 5.579-2.07 7.057-.237.276-.557.582-1.155.835-1.652.72-.441 1.925-.898 2.78-.13.243-.192.497-.192.74 0 .75.596 1.399 1.679 1.302 1.461-.13 2.809.905 3.681.905.77 0 1.402-.438 1.696-1.041 1.377-.339 3.077-.296 4.453.059.247.691.917 1.141 1.662 1.141 1.631 0 1.945-1.849 3.816-2.475.674-.225 1.013-.879 1.013-1.488 0-.39-.139-.761-.419-.988zm-9.147-10.465c-.319 0-.583-.258-1-.568-.528-.392-1.065-.618-1.059-1.03 0-.283.379-.37.869-.681.526-.333.731-.671 1.249-.671.53 0 .69.268 1.41.579.708.307 1.201.427 1.201.773 0 .355-.741.609-1.158.868-.613.378-.928.73-1.512.73zm1.665-5.215c.882.141.981 1.691.559 2.454l-.355-.145c.184-.543.181-1.437-.435-1.494-.391-.036-.643.48-.697.922-.153-.064-.32-.11-.523-.127.062-.923.658-1.737 1.451-1.61zm-3.403.331c.676-.168 1.075.618 1.078 1.435l-.31.19c-.042-.343-.195-.897-.579-.779-.411.128-.344 1.083-.115 1.279l-.306.17c-.42-.707-.419-2.133.232-2.295zm-2.115 19.243c-1.963-.893-2.63-.69-3.005-.69-.777 0-1.031-.579-.739-1.127.248-.465.171-.952.11-1.343-.094-.599-.111-.794.478-1.052.815-.346 1.177-.791 1.447-1.124.758-.937 1.523.537 2.15 1.85.407.851 1.208 1.282 1.455 2.225.227.871-.71 1.801-1.896 1.261zm6.987-1.874c-1.384.673-3.147.982-4.466.299-.195-.563-.507-.927-.843-1.293.539-.142.939-.814.46-1.489-.511-.721-1.555-1.224-2.61-2.04-.987-.763-1.299-2.644.045-4.746-.655 1.862-.272 3.578.057 4.069.068-.988.146-2.638 1.496-4.615.681-.998.691-2.316.706-3.14l.62.424c.456.337.838.708 1.386.708.81 0 1.258-.466 1.882-.853.244-.15.613-.302.923-.513.52 2.476 2.674 5.454 2.795 7.15.501-1.032-.142-3.514-.142-3.514.842 1.285.909 2.356.946 3.67.589.241 1.221.869 1.279 1.696l-.245-.028c-.126-.919-2.607-2.269-2.83-.539-1.19.181-.757 2.066-.997 3.288-.11.559-.314 1.001-.462 1.466zm4.846-.041c-.985.38-1.65 1.187-2.107 1.688-.88.966-2.044.503-2.168-.401-.131-.966.36-1.493.572-2.574.193-.987-.023-2.506.431-2.668.295 1.753 2.066 1.016 2.47.538.657 0 .712.222.859.837.092.385.219.709.578 1.09.418.447.29 1.133-.635 1.49zm-8-13.006c-.651 0-1.138-.433-1.534-.769-.203-.171.05-.487.253-.315.387.328.777.675 1.281.675.607 0 1.142-.519 1.867-.805.247-.097.388.285.143.382-.704.277-1.269.832-2.01.832z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M11 17h2v5l-2 2v-7zm3.571-12c0-2.903 2.36-3.089 2.429-5h-10c.068 1.911 2.429 2.097 2.429 5 0 3.771-3.429 3.291-3.429 10h12c0-6.709-3.429-6.229-3.429-10z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M12.026 14.116c-3.475 1.673-7.504 3.619-8.484 4.09-1.848.889-3.542-1.445-3.542-1.445l8.761-4.226 3.265 1.581zm7.93 6.884c-.686 0-1.393-.154-2.064-.479-1.943-.941-2.953-3.001-2.498-4.854.26-1.057-.296-1.201-1.145-1.612l-14.189-6.866s1.7-2.329 3.546-1.436c1.134.549 5.689 2.747 9.614 4.651l.985-.474c.85-.409 1.406-.552 1.149-1.609-.451-1.855.564-3.913 2.51-4.848.669-.321 1.373-.473 2.054-.473 2.311 0 4.045 1.696 4.045 3.801 0 1.582-.986 3.156-2.613 3.973-1.625.816-2.765.18-4.38.965l-.504.245.552.27c1.613.789 2.754.156 4.377.976 1.624.819 2.605 2.392 2.605 3.97 0 2.108-1.739 3.8-4.044 3.8zm-2.555-12.815c.489 1.022 1.876 1.378 3.092.793 1.217-.584 1.809-1.893 1.321-2.916-.489-1.022-1.876-1.379-3.093-.794s-1.808 1.894-1.32 2.917zm-3.643 3.625c0-.414-.335-.75-.75-.75-.414 0-.75.336-.75.75s.336.75.75.75.75-.336.75-.75zm6.777 3.213c-1.215-.588-2.604-.236-3.095.786-.491 1.022.098 2.332 1.313 2.919 1.215.588 2.603.235 3.094-.787.492-1.021-.097-2.33-1.312-2.918z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M12.108 11.488c.263.168.392.225.691.306-.237.244-1.141.244-1.379 0 .29-.086.429-.148.688-.306zm3.988-10.37c-.505 1.013-1.096 2.36-1.375 3.803.307.255.584.56.816.92.174-1.722.955-3.413 1.539-4.554.351-.686.06-1.287-.6-1.287-.32 0-.726.141-1.188.48-1.156.85-2.057 2.033-2.681 3.519.321.042.634.122.933.235.862-1.938 2.119-2.89 2.556-3.116zm-7.523 4.734c.231-.36.507-.667.817-.925-.279-1.446-.871-2.795-1.377-3.809.657.34 1.796 1.416 2.557 3.118.299-.113.612-.193.932-.236-.624-1.487-1.525-2.67-2.681-3.52-.462-.34-.868-.48-1.187-.48-.661 0-.952.603-.601 1.287.585 1.143 1.368 2.838 1.54 4.565zm8.719 5.186c-.125.501-.342.97-.646 1.396.709.468.473 1.112-.664 1.514-2.229.788-5.741.8-7.965 0-1.152-.414-1.339-1.097-.573-1.564-.294-.427-.504-.896-.62-1.397-1.107.484-1.824 1.167-1.824 2.052 0 4.152 14 4.154 14 0 0-.853-.668-1.519-1.708-2.001zm-10.812-.813c.363-.083.774-.138 1.202-.165.005-.3.056-.595.151-.88-.268-.066-.538-.116-.806-.148-.165-.02-.138-.279.029-.26.291.035.582.09.871.163.15-.348.366-.677.643-.972.01-.81.313-1.581.867-2.192.663-.732 1.618-1.153 2.622-1.153s1.959.42 2.622 1.153c.554.612.856 1.383.866 2.192.284.303.504.639.654.997.321-.085.646-.148.969-.187.166-.02.193.24.029.26-.302.037-.605.095-.906.174.089.275.137.56.143.849.465.024.917.081 1.31.171.161.037.11.293-.054.256-.379-.086-.814-.142-1.263-.166-.142 2.047-2.261 3.337-4.37 3.337-2.185 0-4.228-1.35-4.369-3.331-.411.026-.807.08-1.155.159-.164.036-.218-.22-.055-.257zm2.302.648c.4-.164.805-.287 1.169-.347l-.004-.076c-.4-.08-.851-.127-1.312-.143.02.193.07.383.147.566zm6.455.2c-.348-.135-.694-.237-1.004-.289-.067.312-.226.617-.475.784-.443.278-1.199-.081-1.647-.348-.452.269-1.202.627-1.647.348-.25-.168-.409-.474-.475-.783-.336.057-.713.171-1.089.323.536.933 1.769 1.562 3.159 1.562 1.294 0 2.612-.57 3.178-1.597zm-4.384.105c.198 0 .459-.097.688-.206.202-.096.332-.306.332-.538 0-.229-.12-.439-.312-.551-.271-.156-.574-.294-.768-.294-.245 0-.375.496-.376.783-.001.322.126.806.436.806zm1.827-.206c.229.109.491.206.688.206.309 0 .438-.483.436-.806-.001-.346-.158-.783-.376-.783-.195 0-.498.138-.769.294-.191.111-.311.322-.311.55 0 .233.13.443.332.539zm2.801-.661c-.425.019-.838.065-1.208.14l-.004.074c.337.056.709.165 1.081.311.068-.17.113-.346.131-.525zm-.086-.809c-.397.161-.782.355-1.142.582l.013.102c.377-.073.796-.118 1.226-.136-.006-.198-.042-.38-.097-.548zm-6.558-.277c.415.162.816.36 1.192.591.083-.262.241-.511.455-.644.233-.129.524-.068.773.024.114-.215.379-.589.861-.589.473 0 .746.363.867.581.244-.087.526-.142.753-.016.215.135.373.385.455.646.35-.215.722-.401 1.106-.557-.209-.439-.507-.697-.71-.89.1-1.748-1.116-2.772-2.529-2.772-1.426 0-2.628 1.04-2.529 2.772-.203.192-.485.437-.694.854zm-.211.82c.465.014.922.061 1.329.139l.013-.103c-.387-.243-.803-.45-1.233-.617-.062.177-.103.37-.109.581zm4.605-1.626c.292 0 .53-.326.53-.729s-.238-.729-.53-.729c-.293 0-.53.326-.53.729s.237.729.53.729zm4.598 14.383c-.991.806-3.379 1.198-5.788 1.198-2.458 0-4.938-.408-5.975-1.198 1.097-2.361.859-4.82.222-6.709 2.945 1.416 8.422 1.403 11.318-.054-.672 1.995-.884 4.276.223 6.763zm-1.438-.315c-.433-1.181-.731-3.436-.347-4.99l-.805.185c-.271 1.297-.117 3.554.387 5.014.18.039.626-.082.765-.209zm-5.431-14.068c.293 0 .53-.326.53-.729s-.237-.729-.53-.729-.53.326-.53.729.237.729.53.729z"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 24 24"><path d="M4.908 2.081l-2.828 2.828 19.092 19.091 2.828 -2.828-19.092-19.091zm2.121 6.363l-3.535-3.535 1.414-1.414 3.535 3.535-1.414 1.414zm1.731-5.845c1.232.376 2.197 1.341 2.572 2.573.377-1.232 1.342-2.197 2.573-2.573-1.231-.376-2.196-1.34-2.573-2.573-.375 1.232-1.34 2.197-2.572 2.573zm-5.348 6.954c-.498 1.635-1.777 2.914-3.412 3.413 1.635.499 2.914 1.777 3.412 3.411.499-1.634 1.778-2.913 3.412-3.411-1.634-.5-2.913-1.778-3.412-3.413zm9.553-3.165c.872.266 1.553.948 1.819 1.82.266-.872.948-1.554 1.819-1.82-.871-.266-1.553-.948-1.819-1.82-.266.871-.948 1.554-1.819 1.82zm4.426-6.388c-.303.994-1.082 1.772-2.075 2.076.995.304 1.772 1.082 2.077 2.077.303-.994 1.082-1.772 2.074-2.077-.992-.303-1.772-1.082-2.076-2.076z"/></svg>`,
].sort(() => Math.random() - 0.5).slice(0, 8).map((svg, i) => ({ svg, i }));
const colors = ["orange", "orangered", "crimson", "deeppink", "springgreen", "turquoise", "deepskyblue", "yellowgreen"];

const content = `<div class="cards" style="perspective: 500px; display: grid; grid-template: repeat(4, auto) / repeat(4, auto); gap: 8px; place-content: center center; backface-visibility: hidden;">
    ${[...cards, ...cards].sort(() => Math.random() - 0.5).map(card => {
        return `
            <button class="card" type="button" style="all: unset; display: block; cursor: pointer;">
                <span data-id="card-${card.i}" class="card-inner" style="transition: transform 0.25s ease; will-change: transform; transform-style: preserve-3d; backface-visibility: hidden; display: grid; place-items: center center;">
                    <span class="front" style="grid-area: 1 / 1; background: white; padding: 2px; border-radius: 8px; transform: translateZ(1px);">
                        <svg style="display: block;" width="40" height="40" viewBox="0 0 404 379" fill="none"><path fill="#FAAA47" d="M257.583 56.297c.715-1.93-1.895-3.167-3.481-1.65l-66.496 63.588c-.801.766-.843 1.904-.096 2.588l32.029 29.328c1.076.985 3.057.466 3.578-.938z"/><path fill="#FE8515" d="M174.217 195.848c-1.435.056-2.225-1.758-1.402-3.22l31.37-55.734c.632-1.123 1.914-1.428 2.735-.651l55.312 52.376c1.288 1.22.399 3.804-1.332 3.871z"/><path fill="#FE9615" d="M185.215 174.749c-1.456.932-3.384-.024-3.244-1.609l4.58-51.929c.146-1.658 2.391-2.447 3.628-1.276l30.87 29.223c.873.826.69 2.197-.383 2.885z"/><path fill="#FAAA47" d="M57.785 191.426c-2.057-.064-2.219-2.949-.216-3.846l83.966-37.614c1.012-.454 2.081-.064 2.433.886l15.089 40.723c.506 1.368-.721 3.007-2.218 2.96z"/><path fill="#FE8515" d="M218.469 166.826c.592-1.308-.789-2.723-2.454-2.512l-63.448 8.042c-1.278.162-2.045 1.235-1.634 2.287l27.657 70.978c.644 1.653 3.372 1.804 4.087.226z"/><path fill="#FE9615" d="M194.78 169.058c1.413-.997 1.254-3.144-.267-3.612l-49.824-15.336c-1.59-.489-3.167 1.292-2.549 2.879l15.427 39.61c.436 1.12 1.775 1.468 2.817.733z"/><g filter="url(#a)"><path fill="url(#b)" d="M265.128 280.41c.632 1.919-1.656 3.457-3.195 2.149l-103.209-87.732a2 2 0 0 1-.699-1.373l-5.632-74.086c-.118-1.548 1.497-2.634 2.886-1.941l66.496 33.148c.478.239.84.658 1.007 1.165z"/></g><defs><linearGradient id="b" x1="267.351" x2="119.714" y1="287.165" y2="250.185" gradientUnits="userSpaceOnUse"><stop stop-color="#F90000"/><stop offset="1" stop-color="#F90"/></linearGradient><filter id="a" width="120.849" height="173.832" x="148.387" y="117.213" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_6_204"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_6_204" result="shape"/></filter></defs></svg>
                    </span>
                    <span class="back" style="grid-area: 1 / 1; background: white; padding: 6px; border-radius: 8px; transform: rotateY(180deg);">
                        ${card.svg.replace(`<svg`, `<svg style="display: block;" fill="${colors[card.i]}"`)}
                    </span>
                </span>
            </button>`;
    }).join("")}
</div>`;
const btns = [
    {
        className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
        id: Dialogs.DIALOG_BTN_OK,
        text: "I'm done!"
    },
    {
        className: Dialogs.DIALOG_BTN_CLASS_LEFT,
        id: Dialogs.DIALOG_BTN_CANCEL,
        text: "Cancel"
    }
];

const dialog = Dialogs.showModalDialog("", "Code By Code: Pexeso", content, btns);
const $dialog = dialog.getElement();
const dialogPromise = dialog.getPromise();

const cardsEl = $dialog.find(".cards")[0];
let state = "idle";
let flippedId = null;
let score = 0;

$dialog.on("click", ".card", function (event) {
    const cardInner = this.closest(".card-inner") || this.querySelector(".card-inner");
    if (!cardInner || cardInner.classList.contains("done")) return;
    event.preventDefault();
    
    switch (state) {
        case "idle":
            state = "flipped";
            cardInner.style.transform = "rotateY(180deg)";
            cardInner.classList.add("flipped");
            flippedId = cardInner.dataset.id;
            break;
            
        case "flipped":
            state = "flipped2";
            
            if (cardInner.classList.contains("flipped")) {
                cardInner.style.transform = "";
                cardInner.classList.remove("flipped");
                setTimeout(() => {
                    state = "idle";
                    flippedId = null;
                }, 300);
                break;
            }
            
            cardInner.style.transform = "rotateY(180deg)";
            cardInner.classList.add("flipped");
            setTimeout(() => {
                if (flippedId === cardInner.dataset.id) {
                    flippedId = null;
                    score++;
                    state = score === cards.length ? "win": "idle";
                    cardsEl.querySelectorAll(state === "win" ? ".card-inner": ".flipped").forEach(flipped => {
                        flipped.classList.add("done");
                        flipped.classList.remove("flipped");
                        const svg = flipped.querySelector(".back svg");
                        svg.animate(
                            [ { opacity: 1 }, { opacity: 0.666 }, { opacity: 1 } ], 
                            { iterations: 3, duration: 300, easing: "ease-in", delay: 300 }
                        );
                    });
                    return;
                }
                setTimeout(() => {
                    state = "idle";
                    flippedId = null;
                    cardsEl.querySelectorAll(".flipped").forEach(flipped => {
                        flipped.style.transform = "";
                        flipped.classList.remove("flipped");
                    });
                }, 450);
            }, 300);
            break;
    }
});

const closedBy = await dialogPromise;
$dialog.off("click");
if (closedBy === Dialogs.DIALOG_BTN_CANCEL) return abort();
    
const start = " ".repeat(COMMAND === "output" ? 0: SELECTION.start.ch) + (LANGUAGE.match(/html|xml|svg/i) ? "<!--": "/*");
const end = LANGUAGE.match(/html|xml|svg/i) ? "-->": "*/";
const win = `-------------------------------------------------------
-------------------------------------------------------
------ Score: ${score} / ${cards.length} -----------------------------------
------ Congratulation! You wasted a lot of time! ------
-------------------------------------------------------
-------------------------------------------------------`;
const lost = `-------------------------------------------------------
-------------------------------------------------------
------ Score: ${score} / ${cards.length} -----------------------------------
------ You lost! Try harder next time! ----------------
-------------------------------------------------------
-------------------------------------------------------`;
return (COMMAND === "output" ? "": "\n") + (state === "win" ? win: lost)
    .replace(/^/mg, start).replace(/$/mg, end) + (COMMAND === "output" ? "": "\n");